import ethers from 'ethers';
import getAndInsertPairs from './utils/getAndInsertPairs.js';
import { getAccount, factoryABI } from './utils/utils.js';

const main = async () => {
    const addresses = {
        netswapFactory: '0x70f51d68d16e8f9e418441280342bd43ac9dff9f',
        tethysFactory: '0x2cdfb20205701ff01689461610c9f321d1d00f80',
    };

    const knownTokens = {
        '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000': {
            symbol: 'METIS',
            inUSD: 150,
        },
        '0x420000000000000000000000000000000000000a': {
            symbol: 'WETH',
            inUSD: 3200,
        },
        '0xea32a96608495e54156ae48931a7c20f0dcc1a21': {
            symbol: 'mUSDC',
            inUSD: 1,
        },
        '0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc': {
            symbol: 'mUSDT',
            inUSD: 1,
        },
    };

    const account = getAccount('http', 'METIS');

    const netswapFactory = new ethers.Contract(addresses.netswapFactory, factoryABI, account);
    const tethysFactory = new ethers.Contract(addresses.tethysFactory, factoryABI, account);

    await getAndInsertPairs(account, netswapFactory, 'METIS', 'netswap', knownTokens, 10000);
    await getAndInsertPairs(account, tethysFactory, 'METIS', 'tethys', knownTokens, 10000);
};

await main();
console.log('done');
