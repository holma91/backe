import { pancakeswap } from './bsc.js';
import { uniswapV2, sushiswap } from './eth.js';
import { spookyswap } from './ftm.js';
import { zipswap } from './optimism.js';
import { sushiswapARBITRUM } from './arbitrum.js';
import { trisolaris } from './aurora.js';
import { netswap, tethys } from './metis.js';

const uniswapV2Dexes = [
    pancakeswap,
    uniswapV2,
    sushiswap,
    spookyswap,
    zipswap,
    sushiswapARBITRUM,
    trisolaris,
    netswap,
    tethys,
];

const uniswapV3Dexes = []; // [uniswap, uniswapARBITRUM];

export { uniswapV2Dexes, uniswapV3Dexes };
