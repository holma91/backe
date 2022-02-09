import ethers from 'ethers';
import { getAccount, uniV2Pair } from '../utils/utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';

const stablecoins = {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
        address: 'USDC',
        usdValue: new Big(1.0),
    },
    '0xdac17f958d2ee523a2206206994597c13d831ec7': {
        symbol: 'USDT',
        usdValue: new Big(1.0),
    },
    '0x6b175474e89094c44da98b954eedeac495271d0f': {
        symbol: 'DAI',
        usdValue: new Big(1.0),
    },
    '0x4fabb145d64652a948d72533023f6e7a623c7c53': {
        symbol: 'BUSD',
        usdValue: new Big(1.0),
    },
};

const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const stablecoinAddresses = Object.keys(stablecoins);

const getPrice = async (token) => {
    let price = 0;
    try {
        switch (token) {
            case 'WETH':
                let response = await fetch(
                    'https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&vs_currencies=usd'
                );
                let data = await response.json();
                price = data[WETH]['usd'];
                break;
        }
    } catch (e) {
        console.log(`problem with ${token}`);
        console.log(e);
    }
    return price;
};

const existsOnCoingecko = async (chain, address) => {
    let network;

    switch (chain) {
        case 'ETH':
            network = 'ethereum';
            break;
        default:
            break;
    }

    try {
        let response = await fetch(
            `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${address}&vs_currencies=usd`
        );
        let data = await response.json();

        return data[address] !== undefined;
    } catch (e) {
        console.log(e);
    }
};

const isSenderInteresting = async (sender) => {
    const response = await fetch(`http://localhost:3005/accounts/${sender}/`);
    return response.status !== 404;
};

const setUpPair = (pair, account) => {
    const pairContract = new ethers.Contract(pair.pairAddress, uniV2Pair, account);

    pairContract.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
        sender = sender.toLowerCase();
        // if (!isSenderInteresting(sender)) {
        //     console.log(`${sender} is not of interest`);
        //     return;
        // }

        let swap = {
            pair: pair.pairAddress,
            chain: 'ETH',
            sender,
            token0: {
                symbol: pair.token0Symbol,
                address: pair.token0Address,
                in: ethers.utils.formatUnits(amount0In, pair.token0Decimals),
                out: ethers.utils.formatUnits(amount0Out, pair.token0Decimals),
                priceUSD: 0,
                onCoingecko: false,
            },
            token1: {
                symbol: pair.token1Symbol,
                address: pair.token1Address,
                in: ethers.utils.formatUnits(amount1In, pair.token1Decimals),
                out: ethers.utils.formatUnits(amount1Out, pair.token1Decimals),
                priceUSD: 0,
                onCoingecko: false,
            },
        };

        if (pair.token0Address === WETH || stablecoinAddresses.includes(pair.token0Address)) {
            swap.token0.priceUSD = pair.token0Address === WETH ? new Big(await getPrice('WETH')) : new Big(1);

            if (swap.token0.in !== '0.0') {
                // token0in, token1out
                swap.token1.priceUSD = swap.token0.priceUSD.times(swap.token0.in).div(swap.token1.out).toFixed(6);
            } else if (swap.token0.out !== '0.0') {
                // token0out, token1in
                swap.token1.priceUSD = swap.token0.priceUSD.times(swap.token0.out).div(swap.token1.in).toFixed(6);
            }
            swap.token0.priceUSD = swap.token0.priceUSD.toFixed(6);
            swap.token0.onCoingecko = true;
            swap.token1.onCoingecko = await existsOnCoingecko('ETH', swap.token1.address);
        } else if (pair.token1Address === WETH || stablecoinAddresses.includes(pair.token1Address)) {
            swap.token1.priceUSD = pair.token1Address === WETH ? new Big(await getPrice('WETH')) : new Big(1);

            if (swap.token1.in !== '0.0') {
                // token1in, token0out
                swap.token0.priceUSD = swap.token1.priceUSD.times(swap.token1.in).div(swap.token0.out).toFixed(6);
            } else if (swap.token1.out !== '0.0') {
                // token1out, token0in
                swap.token0.priceUSD = swap.token1.priceUSD.times(swap.token1.out).div(swap.token0.in).toFixed(6);
            }
            swap.token1.priceUSD = swap.token1.priceUSD.toFixed(6);
            swap.token1.onCoingecko = true;
            swap.token0.onCoingecko = await existsOnCoingecko('ETH', swap.token0.address);
        }

        console.log(swap);

        // set up api routes
        // save to db and stuff
    });
};

const main = async () => {
    const response = await fetch('http://localhost:3005/pairs/eth/');
    let pairs = await response.json();

    const account = getAccount('http', 'ETH');

    for (const pair of pairs) {
        setUpPair(pair, account);
    }
};

await main();
