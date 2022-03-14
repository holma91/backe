import { uniswapV2Dexes } from './LpBots/index.js';
import onPairCreated from './LpBots/createdPair.js';

// initialize event listeners for all chosen uniswap V2 dexes
for (const dex of uniswapV2Dexes) {
    dex['factory'].on('PairCreated', async (token0Address, token1Address, addressPair) => {
        onPairCreated(
            dex['provider'],
            token0Address,
            token1Address,
            addressPair,
            dex['chainName'],
            dex['dexName'],
            dex['knownTokens']
        );
    });
    console.log(`initiated listener for ${dex['dexName']}`);
}
