import { getAccount } from '../utils/utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';
import 'dotenv/config';

const stablecoins = {
    '0xb12bfca5a55806aaf64e99521918a4bf0fc40802': {
        symbol: 'USDC',
        usdValue: new Big(1.0),
    },
    '0x4988a896b1227218e4a686fde5eabdcabd91571f': {
        symbol: 'USDT',
        usdValue: new Big(1.0),
    },
};

const WETH = '0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb';

const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;

const response = await fetch(`${URL}/pairs/aurora/trisolaris`);
let pairs = await response.json();

const account = getAccount('http', 'AURORA');

const trisolaris = {
    chain: 'AURORA',
    pairs,
    account,
    nativeTokenAddress: WETH,
    stablecoins,
};

export { trisolaris };
