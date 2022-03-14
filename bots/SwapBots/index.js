import { pancakeswap } from './chains/bsc.js';
import { uniswapV2, sushiswap } from './chains/eth.js';
import { spookyswap } from './chains/ftm.js';
import { zipswap } from './chains/optimism.js';
import { sushiswapARBITRUM } from './chains/arbitrum.js';
import { trisolaris } from './chains/aurora.js';
import { netswap, tethys } from './chains/metis.js';

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

export { uniswapV2Dexes };
