import ethers from 'ethers';
import getAndInsertPairs from './utils/getAndInsertPairs.js';
import { getAccount, factoryABI } from './utils/utils.js';

const main = async () => {
    const addresses = {
        uniswapFactory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        sushiswapFactory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    };

    const knownTokens = {
        WETH: {
            address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            inUSD: 2500,
        },
        USDC: {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            inUSD: 1.0,
        },
        USDT: {
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            inUSD: 1.0,
        },
        DAI: {
            address: '0x6b175474e89094c44da98b954eedeac495271d0f',
            inUSD: 1.0,
        },
    };

    const account = getAccount('http', 'ETH');
    const sushiswapFactory = new ethers.Contract(addresses.sushiswapFactory, factoryABI, account);

    await getAndInsertPairs(account, sushiswapFactory, 'ETH', 'sushiswap', knownTokens);
};

await main();
console.log('done');