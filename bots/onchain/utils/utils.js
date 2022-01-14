import { APIKEY_BSCSCAN, APIKEY_FTMSCAN } from '../env.js';
import ethers from 'ethers';
import fetch from 'node-fetch';

export const uniV2Factory = ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'];
export const uniV3Factory = [
    'event PoolCreated(address token0, address token1, uint24 fee, int24 tickSpacing, address pool)',
];

const getTokenMetadata = async (tokenAddress, account) => {
    let token = {
        address: tokenAddress,
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
            let contract = new ethers.Contract(token.address, tokenInfoABI, account);
            token.name = await contract.name();
            token.symbol = await contract.symbol();
            token.decimals = await contract.decimals();
            token.deployerAddress = contract.address;
            success = true;
        } catch (e) {
            // console.log(e);
            //console.log(`couldn't find token info for token with address ${tokenAddress} on try ${count}`);
            sleep(1000);
            if (count > 10) break;
        }
    }

    return token;
};

const getPairLiquidity = async (token0Decimals, token1Decimals, addressPair, account) => {
    const pairContract = new ethers.Contract(
        addressPair,
        [
            'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
        ],
        account
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
            //console.log(`couldn't find info for pair with address ${addressPair} on try ${count}`);
            sleep(1000);
            if (count > 10) break;
        }
    }

    // console.log('RESERVES', reserves);

    let liq0 = ethers.utils.formatUnits(reserves['reserve0'], token0Decimals);
    let liq1 = ethers.utils.formatUnits(reserves['reserve1'], token1Decimals);

    return { liq0, liq1 };
};

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const displayPair = (token0, token1, addressPair, tokenDeployerAddress, dex) => {
    const pair = {
        'token #0': `${token0.name} (${token0.symbol})`,
        'token #0 decimals': token0.decimals,
        'token #0 address': token0.address,
        'token #0 liquidity': token0.liq,
        'token #1': `${token1.name} (${token1.symbol})`,
        'token #1 decimals': token1.decimals,
        'token #1 address': token1.address,
        'token #1 liquidity': token1.liq,
        'token deployer address': tokenDeployerAddress,
        'pair address': addressPair,
        DEX: dex,
    };
    console.table(pair);
};

const getContractDeployerInfo = async (contractAddress, chain) => {
    // this functionality is only implemented for bsc at the moment
    if (chain !== 'BSC') {
        return '';
    }
    let contractCreator = '';
    let success = false;
    let count = 0;

    while (!success) {
        try {
            count++;
            const txs = await getTransactions(contractAddress, chain);

            if (txs.length > 0 && txs[0]['to'] === '') {
                contractCreator = txs[0]['from'];
            } else {
                // contract was deployed via an internal transaction
                const internalTxs = await getInternalTransactions(contractAddress);
                if (internalTxs.length < 1) {
                    // no normal txs and no internal txs => etherscan not updated
                    throw 'block explorer not updated';
                }
                if (internalTxs.length < 1) {
                    console.log('AFTER THROW');
                }

                if (internalTxs[0]['to'] === '') {
                    contractAddress = internalTxs[0]['from'];
                }

                // recurses until inital EOA account is found
                contractCreator = getContractDeployerInfo(contractAddress);
            }
            success = true;
        } catch (err) {
            if (count === 1 || count === 100) {
                // only log the first and last error
                //console.error(err, `, can't find creator for ${contractAddress} on try ${count}`);
            }
            sleep(500);
            if (count > 100) break;
        }
    }

    return contractCreator;
};

const getTransactions = async (address, chain) => {
    let res;
    if (chain === 'BSC') {
        res = await fetch(
            `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&page=1&offset=10000&sort=asc&apikey=${APIKEY_BSCSCAN}`
        );
    } else if (chain === 'FTM') {
        res = await fetch(
            `https://api.ftmscan.com/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${APIKEY_FTMSCAN}`
        );
    }

    const txs = await res.json();
    return txs['result'];
};
const getInternalTransactions = async (address) => {
    const res = await fetch(
        `https://api.bscscan.com/api?module=account&action=txlistinternal&address=${address}&page=1&offset=10&sort=asc&apikey=${APIKEY_BSCSCAN}`
    );
    const internalTxs = await res.json();

    return internalTxs['result'];
};

const onPairCreated = async (
    account,
    token0Address,
    token1Address,
    addressPair,
    chain,
    dex,
    established_tokenAddresses
) => {
    let token0 = await getTokenMetadata(token0Address, account);
    let token1 = await getTokenMetadata(token1Address, account);

    const { liq0, liq1 } = await getPairLiquidity(token0.decimals, token1.decimals, addressPair, account);
    token0.liq = liq0;
    token1.liq = liq1;

    let tokenDeployerAddress = '';
    if (!Object.values(established_tokenAddresses).includes(token0Address)) {
        tokenDeployerAddress = await getContractDeployerInfo(token0Address, chain);
    } else if (!Object.values(established_tokenAddresses).includes(token1Address)) {
        tokenDeployerAddress = await getContractDeployerInfo(token1Address, chain);
    }

    displayPair(token0, token1, addressPair, tokenDeployerAddress, dex);
};

export { getTokenMetadata, getPairLiquidity, displayPair, getContractDeployerInfo, onPairCreated };

// if (txs['status'] === '0') {
//     if (txs['message'] !== 'No transactions found') {
//         throw txs['message'];
//     }
// }
