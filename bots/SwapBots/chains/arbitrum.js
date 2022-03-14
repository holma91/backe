import { getProvider } from '../../utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';
import 'dotenv/config';

const stablecoins = {
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': {
        address: 'DAI',
        usdValue: new Big(1.0),
    },
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': {
        symbol: 'USDC',
        usdValue: new Big(1.0),
    },
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': {
        symbol: 'USDT',
        usdValue: new Big(1.0),
    },
};

const WETH = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';

const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;

const response = await fetch(`${URL}/pairs/arbitrum/sushiswap`);
let pairs = await response.json();

const provider = getProvider('http', 'ARBITRUM');

const sushiswapARBITRUM = {
    chain: 'ARBITRUM',
    pairs,
    provider,
    nativeTokenAddress: WETH,
    stablecoins,
};

export { sushiswapARBITRUM };
