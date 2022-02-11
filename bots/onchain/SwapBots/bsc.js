import { getAccount } from '../utils/utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';
import 'dotenv/config';
import setUpPair from './tracker.js';

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

const main = async () => {
    const response = await fetch('http://localhost:3005/pairs/bsc/');
    let pairs = await response.json();

    const account = getAccount('http', 'BSC');

    for (const pair of pairs) {
        setUpPair(pair, account, WBNB, stablecoins);
    }
};

await main();
