import ethers from 'ethers';
import getAndInsertPairs from './utils/getAndInsertPairs.js';
import { getAccount, factoryABI } from './utils/utils.js';

const main = async () => {
    const addresses = {
        zipswapFactory: '0x8bcedd62dd46f1a76f8a1633d4f5b76e0cda521e',
    };

    const knownTokens = {
        '0x4200000000000000000000000000000000000006': {
            symbol: 'WETH',
            inUSD: 3200,
        },
        '0xfa436399d0458dbe8ab890c3441256e3e09022a8': {
            symbol: 'ZIP',
            inUSD: 0.105,
        },
        '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58': {
            symbol: 'USDT',
            inUSD: 1,
        },
        '0x7f5c764cbc14f9669b88837ca1490cca17c31607': {
            symbol: 'USDC',
            inUSD: 1,
        },
        '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': {
            symbol: 'DAI',
            inUSD: 1,
        },
    };

    const account = getAccount('http', 'OPTIMISM');

    const zipswapFactory = new ethers.Contract(addresses.zipswapFactory, factoryABI, account);

    await getAndInsertPairs(account, zipswapFactory, 'OPTIMISM', 'zipswap', knownTokens, 10000);
};

await main();
console.log('done');
