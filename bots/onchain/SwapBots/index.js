import { pancakeswap } from './bsc.js';
import { uniswapV2, sushiswap } from './eth.js';

let uniswapV2Dexes = [pancakeswap, uniswapV2, sushiswap];

let uniswapV3Dexes = []; // [uniswap, uniswapARBITRUM];

export { uniswapV2Dexes, uniswapV3Dexes };
