import ethers from 'ethers';
import getAndInsertPairs from './utils/getAndInsertPairs.js';
import { getAccount, factoryABI } from './utils/utils.js';

const main = async () => {
    const addresses = {
        uniswapFactory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
        sushiswapFactory: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
    };

    const knownTokens = {
        '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': {
            symbol: 'WETH',
            inUSD: 3200,
        },
        '0xfa436399d0458dbe8ab890c3441256e3e09022a8': {
            symbol: 'ZIP',
            inUSD: 0.105,
        },
        '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': {
            symbol: 'USDT',
            inUSD: 1,
        },
        '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': {
            symbol: 'USDC',
            inUSD: 1,
        },
        '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': {
            symbol: 'DAI',
            inUSD: 1,
        },
    };

    const account = getAccount('http', 'ARBITRUM');

    const sushiswapFactory = new ethers.Contract(addresses.sushiswapFactory, factoryABI, account);

    await getAndInsertPairs(account, sushiswapFactory, 'ARBITRUM', 'sushiswap', knownTokens, 10000);
};

await main();
console.log('done');
