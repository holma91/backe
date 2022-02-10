import ethers from 'ethers';
import getAndInsertPairs from './utils/getAndInsertPairs.js';
import { getAccount, factoryABI } from './utils/utils.js';

const main = async () => {
    const addresses = {
        sushiswapFactory: '0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac',
        uniswapV2Factory: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    };

    const knownTokens = {
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
            symbol: 'WETH',
            inUSD: 3200,
        },
        '0xdac17f958d2ee523a2206206994597c13d831ec7': {
            symbol: 'USDT',
            inUSD: 1,
        },
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
            symbol: 'USDC',
            inUSD: 1,
        },
        '0x6b175474e89094c44da98b954eedeac495271d0f': {
            symbol: 'DAI',
            inUSD: 1,
        },
    };

    const account = getAccount('http', 'ETH');

    // const sushiswapFactory = new ethers.Contract(addresses.sushiswapFactory, factoryABI, account);
    // await getAndInsertPairs(account, sushiswapFactory, 'ETH', 'sushiswap', knownTokens, 100000);

    const uniswapV2Factory = new ethers.Contract(addresses.uniswapV2Factory, factoryABI, account);
    await getAndInsertPairs(account, uniswapV2Factory, 'ETH', 'uniswapv2', knownTokens, 100000);
};

await main();
console.log('done');
