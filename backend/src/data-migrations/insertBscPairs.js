import ethers from 'ethers';
import getAndInsertPairs from './utils/getAndInsertPairs.js';
import { getAccount, factoryABI } from './utils/utils.js';

const main = async () => {
    const addresses = {
        pancakeswapFactory: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
    };

    const knownTokens = {
        '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': {
            symbol: 'WBNB',
            inUSD: 420,
        },
        '0xe9e7cea3dedca5984780bafc599bd69add087d56': {
            symbol: 'BUSD',
            inUSD: 1,
        },
        '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': {
            symbol: 'USDC',
            inUSD: 1,
        },
    };

    const account = getAccount('http', 'BSC');

    const pancakeswapFactory = new ethers.Contract(addresses.pancakeswapFactory, factoryABI, account);
    await getAndInsertPairs(account, pancakeswapFactory, 'BSC', 'pancakeswap', knownTokens, 100000);
};

await main();
console.log('done');
