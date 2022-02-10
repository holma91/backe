import { uniswapV2Dexes, uniswapV3Dexes } from './LpBots/index.js';
import { onPairCreated } from './utils/utils.js';

for (const dex of uniswapV2Dexes) {
    dex['factory'].on('PairCreated', async (token0Address, token1Address, addressPair) => {
        await onPairCreated(
            dex['account'],
            token0Address,
            token1Address,
            addressPair,
            dex['chainName'],
            dex['dexName'],
            dex['knownTokens']
        );
    });
    console.log(`initiated ${dex['dexName']}`);
}

for (const dex of uniswapV3Dexes) {
    dex['factory'].on('PoolCreated', async (token0Address, token1Address, fee, tickSpacing, pool) => {
        await onPairCreated(
            dex['account'],
            token0Address,
            token1Address,
            pool,
            dex['chainName'],
            dex['dexName'],
            dex['knownTokens']
        );
    });
    console.log(`initiated ${dex['dexName']}`);
}
