import ethers from 'ethers';
import { getAccount, uniV2Pair } from '../utils/utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';

const knownTokens = {
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
        address: 'WETH',
        usdValue: new Big(3100),
    },
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
};

const knownAddresses = Object.keys(knownTokens);

const setUpPair = (pair, account) => {
    const pairContract = new ethers.Contract(pair.pairAddress, uniV2Pair, account);

    pairContract.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
        let swap = {
            pair: pair.pairAddress,
            chain: 'ETH',
            sender: sender,
            token0: {
                symbol: pair.token0Symbol,
                address: pair.token0Address,
                in: ethers.utils.formatUnits(amount0In, pair.token0Decimals),
                out: ethers.utils.formatUnits(amount0Out, pair.token0Decimals),
                priceUSD: 0,
            },
            token1: {
                symbol: pair.token1Symbol,
                address: pair.token1Address,
                in: ethers.utils.formatUnits(amount1In, pair.token1Decimals),
                out: ethers.utils.formatUnits(amount1Out, pair.token1Decimals),
                priceUSD: 0,
            },
        };

        if (knownAddresses.includes(pair.token0Address.toLowerCase())) {
            swap.token0.priceUSD = knownTokens[pair.token0Address.toLowerCase()]['usdValue'];
            if (swap.token0.in !== '0.0') {
                // token0in, token1out
                swap.token1.priceUSD = swap.token0.priceUSD.times(swap.token0.in).div(swap.token1.out).toFixed(6);
            } else if (swap.token0.out !== '0.0') {
                // token0out, token1in
                swap.token1.priceUSD = swap.token0.priceUSD.times(swap.token0.out).div(swap.token1.in).toFixed(6);
            }
            swap.token0.priceUSD = swap.token0.priceUSD.toFixed(6);
        } else if (knownAddresses.includes(pair.token1Address.toLowerCase())) {
            swap.token1.priceUSD = knownTokens[pair.token1Address.toLowerCase()]['usdValue'];
            if (swap.token1.in !== '0.0') {
                // token1in, token0out
                swap.token0.priceUSD = swap.token1.priceUSD.times(swap.token1.in).div(swap.token0.out).toFixed(6);
            } else if (swap.token1.out !== '0.0') {
                // token1out, token0in
                swap.token0.priceUSD = swap.token1.priceUSD.times(swap.token1.out).div(swap.token0.in).toFixed(6);
            }
            swap.token1.priceUSD = swap.token1.priceUSD.toFixed(6);
        }

        // are sender and/or to interesting?
        console.log(swap);
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
