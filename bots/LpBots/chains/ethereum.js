import ethers from 'ethers';
import { getProvider, uniV2Factory } from '../utils.js';

const addresses = {
    uniswapV2Factory: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    sushiswapFactory: '0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac',
};

const knownTokens = {
    WETH: {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        inUSD: 3200,
    },
    USDC: { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', inUSD: 1 },
    USDT: { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', inUSD: 1 },
    DAI: { address: '0x6b175474e89094c44da98b954eedeac495271d0f', inUSD: 1 },
};

const provider = getProvider('ws', 'ETH');

const uniswapV2 = {
    factory: new ethers.Contract(addresses.uniswapV2Factory, uniV2Factory, provider),
    provider,
    knownTokens,
    dexName: 'uniswapV2',
    chainName: 'ETH',
};

const sushiswap = {
    factory: new ethers.Contract(addresses.sushiswapFactory, uniV2Factory, provider),
    provider,
    knownTokens,
    dexName: 'sushiswap',
    chainName: 'ETH',
};

export { uniswapV2, sushiswap };
