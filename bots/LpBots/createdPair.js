import ethers from 'ethers';
import 'dotenv/config';
import fetch from 'node-fetch';
import { sleep } from './utils.js';

/*
 * onPairCreated is the starting point for every newly found pair
 * it retrieves metadata about the pairs and tokens
 * it retrieves liquidity data about the pair
 */
const onPairCreated = async (provider, token0Address, token1Address, addressPair, chain, dex, knownTokens) => {
    let promises = [getTokenMetadata(token0Address, provider), getTokenMetadata(token1Address, provider)];
    let [token0, token1] = await Promise.all(promises);

    [token0.liq, token1.liq] = await getPairLiquidity(token0.decimals, token1.decimals, addressPair, provider);

    try {
        let pairInfo = getPairInfo(token0, token1, addressPair, chain, dex, knownTokens);
        if (process.env.environment === 'DEV') {
            displayPair(pairInfo);
        }

        const { liquidity, liquidityUSD, newToken } = pairInfo;
        addPair(chain, dex, addressPair, token0, token1, liquidity, liquidityUSD, newToken);
    } catch (e) {
        console.log(e);
    }
};

/*
gets a pair and sends a post request to the backend with the content
*/
const addPair = async (chain, dex, pairAddress, token0, token1, liquidity, liquidityUSD, newToken) => {
    const requestBody = {
        chain,
        dex,
        address: pairAddress,
        token0,
        token1,
        liquidity,
        liquidityUSD,
        newToken,
    };

    const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;

    fetch(`${URL}/pairs`, {
        method: 'post',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
    });
};

/*
given a tokenAddress and a initialized provider
return a token object with an address, name, symbol and decimals
*/
const getTokenMetadata = async (tokenAddress, provider) => {
    let token = {
        address: tokenAddress,
        name: '',
        symbol: '',
        decimals: 0,
    };

    const tokenInfoABI = [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() public view returns (uint8)',
    ];

    let success = false;
    let count = 0;

    while (!success) {
        try {
            count++;
            let contract = new ethers.Contract(token.address, tokenInfoABI, provider);
            let promises = [contract.name(), contract.symbol(), contract.decimals()];
            [token.name, token.symbol, token.decimals] = await Promise.all(promises);
            success = true;
        } catch (e) {
            // too early, the information is not yet available on the pinged node. sleep and try again 10 times
            console.log(`sleeping at ${token.address}`);
            await sleep(3000 * (count + 1));
            if (count > 10) break;
        }
    }

    return token;
};

/*
given the pair address, retrieve the available liquidity
*/
const getPairLiquidity = async (token0Decimals, token1Decimals, addressPair, provider) => {
    // getReserves() returns the number of tokens in a uniswap V2 Pair
    const pairContract = new ethers.Contract(
        addressPair,
        [
            'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
        ],
        provider
    );

    let success = false;
    let count = 0;
    let reserves;

    while (!success) {
        try {
            count++;
            reserves = await pairContract.getReserves();
            success = true;
        } catch (e) {
            // too early, the information is not yet available on the pinged node. sleep and try again 10 times
            await sleep(3000 * (count + 1));
            if (count > 10) break;
        }
    }

    let liq0 = 0;
    let liq1 = 0;

    try {
        liq0 = ethers.utils.formatUnits(reserves['reserve0'], token0Decimals);
        liq1 = ethers.utils.formatUnits(reserves['reserve1'], token1Decimals);
    } catch (e) {
        console.log(`could not find liquidity for tokens in the pair with address ${addressPair}`);
        console.log(e);
    }

    return [liq0, liq1];
};

/*
get more info about the pair
determine which of the tokens in the pair that is the new one
get the liquidity in usd
*/
const getPairInfo = (token0, token1, addressPair, chain, dex, knownTokens) => {
    let pairInfo = {
        liquidity: 0,
        liquidityUSD: 0,
        addressNewToken: '',
        symbolNewToken: '',
        symbolOldToken: '',
        nameNewToken: '',
        address: addressPair,
        chain: chain,
        dex: dex,
        newToken: '',
    };

    let knownAddresses = Object.values(knownTokens).map((token) => token.address.toLowerCase());

    try {
        if (knownAddresses.includes(token0.address.toLowerCase())) {
            pairInfo.liquidity = parseInt(token0.liq);
            pairInfo.liquidityUSD = parseInt(pairInfo.liquidity) * knownTokens[token0.symbol]['inUSD'];
            pairInfo.symbolOldToken = token0.symbol;
            pairInfo.addressNewToken = token1.address;
            pairInfo.symbolNewToken = token1.symbol;
            pairInfo.nameNewToken = token1.name;
            pairInfo.newToken = 'token1';
        } else if (knownAddresses.includes(token1.address.toLowerCase())) {
            pairInfo.liquidity = parseInt(token1.liq);
            pairInfo.liquidityUSD = parseInt(pairInfo.liquidity) * knownTokens[token1.symbol]['inUSD'];
            pairInfo.symbolOldToken = token1.symbol;
            pairInfo.addressNewToken = token0.address;
            pairInfo.symbolNewToken = token0.symbol;
            pairInfo.nameNewToken = token0.name;
            pairInfo.newToken = 'token0';
        } else {
            // none of the addresses in the pair are known... liq is with high certainty 0
            // do nothing
        }
    } catch (e) {
        console.log(`error with token0: ${token0.symbol} ${token0.address}`);
        console.log(`error with token1: ${token1.symbol} ${token1.address}`);
        console.error(e);
    }

    return pairInfo;
};

/*
display the pair info in the CLI
*/
const displayPair = (pairInfo) => {
    const FgRed = '\x1b[31m';
    const FgGreen = '\x1b[32m';
    const FgYellow = '\x1b[33m';

    let color = '';
    if (pairInfo.liquidityUSD >= 10000.0) {
        color = FgGreen;
    } else if (pairInfo.liquidityUSD >= 5000.0) {
        color = FgYellow;
    } else {
        color = FgRed;
    }

    console.log(color, `${color}`);
    console.log(
        `${pairInfo.symbolOldToken}/${pairInfo.symbolNewToken}\n${pairInfo.nameNewToken}\nliq (${
            pairInfo.symbolOldToken
        }, USD): ${pairInfo.liquidity.toFixed(2)}, $${pairInfo.liquidityUSD.toFixed(2)}\n${
            pairInfo.symbolNewToken
        } address: ${pairInfo.addressNewToken}\npair: ${pairInfo.address}\n${pairInfo.dex}\n`
    );
};

export default onPairCreated;
