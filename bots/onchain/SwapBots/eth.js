import { getAccount } from '../utils/utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';
import 'dotenv/config';

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
const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;

const response1 = await fetch(`${URL}/pairs/eth/uniswapV2`);
let uniswapV2Pairs = await response1.json();

const response2 = await fetch(`${URL}/pairs/eth/sushiswap`);
let sushiswapPairs = await response2.json();

const account = getAccount('ws', 'ETH');

const uniswapV2 = {
    chain: 'ETH',
    pairs: uniswapV2Pairs,
    account,
    nativeTokenAddress: WETH,
    stablecoins,
};

const sushiswap = {
    chain: 'ETH',
    pairs: sushiswapPairs,
    account,
    nativeTokenAddress: WETH,
    stablecoins,
};

export { sushiswap, uniswapV2 };
