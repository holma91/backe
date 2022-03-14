import { getAccount } from '../utils/utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';
import 'dotenv/config';

const stablecoins = {
    '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e': {
        address: 'DAI',
        usdValue: new Big(1.0),
    },
    '0x04068da6c83afcfa0e13ba15a6696662335d5b75': {
        symbol: 'USDC',
        usdValue: new Big(1.0),
    },
};

const WFTM = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83';

const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;

const response = await fetch(`${URL}/pairs/ftm/spookyswap`);
let pairs = await response.json();

const account = getAccount('http', 'FTM');

const spookyswap = {
    chain: 'FTM',
    pairs,
    account,
    nativeTokenAddress: WFTM,
    stablecoins,
};

export { spookyswap };
