import { pancakeswap } from './bsc.js';
import { trisolaris, wannaswap } from './aurora.js';
import { spookyswap } from './ftm.js';
import { fusefi } from './fuseio.js';
import { netswap, tethys } from './metis.js';
import { zipswap } from './optimism.js';
import { traderjoe, pangolin } from './avalanche.js';
import { uniswap, sushiswap } from './ethereum.js';

let uniswapV2Dexes = [
    pancakeswap,
    // trisolaris,
    // wannaswap,
    // spookyswap,
    // fusefi,
    // netswap,
    // tethys,
    // zipswap,
    // traderjoe,
    // pangolin,
    // sushiswap,
];

let uniswapV3Dexes = [uniswap];

export { uniswapV2Dexes, uniswapV3Dexes };
