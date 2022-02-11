import { pancakeswap } from './bsc.js';
import { trisolaris, wannaswap } from './aurora.js';
import { spookyswap } from './ftm.js';
import { fusefi } from './fuseio.js';
import { netswap, tethys } from './metis.js';
import { zipswap } from './optimism.js';
import { traderjoe, pangolin } from './avalanche.js';
import { uniswapV3, uniswapV2, sushiswap } from './ethereum.js';
import { uniswapARBITRUM, sushiswapARBITRUM } from './arbitrum.js';

let uniswapV2Dexes = [
    pancakeswap,
    trisolaris,
    wannaswap,
    spookyswap,
    fusefi,
    netswap,
    tethys,
    zipswap,
    traderjoe,
    pangolin,
    sushiswap,
    uniswapV2,
    sushiswapARBITRUM,
];

let uniswapV3Dexes = []; // [uniswap, uniswapARBITRUM];

export { uniswapV2Dexes, uniswapV3Dexes };
