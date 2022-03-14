import { pancakeswap } from './chains/bsc.js';
import { trisolaris, wannaswap } from './chains/aurora.js';
import { spookyswap } from './chains/ftm.js';
import { fusefi } from './chains/fuseio.js';
import { netswap, tethys } from './chains/metis.js';
import { zipswap } from './chains/optimism.js';
import { traderjoe, pangolin } from './chains/avalanche.js';
import { uniswapV2, sushiswap } from './chains/ethereum.js';
import { sushiswapARBITRUM } from './chains/arbitrum.js';

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

export { uniswapV2Dexes };
