import { getProvider } from '../../utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';
import 'dotenv/config';

const stablecoins = {
    '0xe9e7cea3dedca5984780bafc599bd69add087d56': {
        address: 'BUSD',
        usdValue: new Big(1.0),
    },
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': {
        symbol: 'USDC',
        usdValue: new Big(1.0),
    },
};

const WBNB = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';

const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;

const response = await fetch(`${URL}/pairs/bsc/pancakeswap`);
let pairs = await response.json();

const provider = getProvider('http', 'BSC');

const pancakeswap = {
    chain: 'BSC',
    pairs,
    provider,
    nativeTokenAddress: WBNB,
    stablecoins,
};

export { pancakeswap };
