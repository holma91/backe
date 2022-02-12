import { getAccount } from '../utils/utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';
import 'dotenv/config';

const stablecoins = {
    '0xea32a96608495e54156ae48931a7c20f0dcc1a21': {
        address: 'm.USDC',
        usdValue: new Big(1.0),
    },
    '0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc': {
        symbol: 'm.USDT',
        usdValue: new Big(1.0),
    },
};

const METIS = '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000';
const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;

const response1 = await fetch(`${URL}/pairs/metis/netswap`);
let netswapPairs = await response1.json();

const response2 = await fetch(`${URL}/pairs/metis/tethys`);
let tethysPairs = await response2.json();

const account = getAccount('http', 'METIS');

const netswap = {
    chain: 'METIS',
    pairs: netswapPairs,
    account,
    nativeTokenAddress: METIS,
    stablecoins,
};

const tethys = {
    chain: 'METIS',
    pairs: tethysPairs,
    account,
    nativeTokenAddress: METIS,
    stablecoins,
};

export { netswap, tethys };
