import { pancakeswap } from './bsc.js';
import { uniswapV2, sushiswap } from './eth.js';
import { spookyswap } from './ftm.js';
import { zipswap } from './optimism.js';

let uniswapV2Dexes = [pancakeswap, uniswapV2, sushiswap, spookyswap, zipswap];

let uniswapV3Dexes = []; // [uniswap, uniswapARBITRUM];

export { uniswapV2Dexes, uniswapV3Dexes };
