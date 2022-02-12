import { getAccount } from '../utils/utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';
import 'dotenv/config';

const stablecoins = {
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': {
        address: 'DAI',
        usdValue: new Big(1.0),
    },
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': {
        symbol: 'USDC',
        usdValue: new Big(1.0),
    },
    '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58': {
        symbol: 'USDT',
        usdValue: new Big(1.0),
    },
};

const WETH = '0x4200000000000000000000000000000000000006';

const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;

const response = await fetch(`${URL}/pairs/optimism/zipswap`);
let pairs = await response.json();

const account = getAccount('http', 'OPTIMISM');

const zipswap = {
    chain: 'OPTIMISM',
    pairs,
    account,
    nativeTokenAddress: WETH,
    stablecoins,
};

export { zipswap };
