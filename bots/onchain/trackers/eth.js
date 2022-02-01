import { getAccount } from '../utils/utils.js';
import { ethers } from 'ethers';

const addresses = {
    uniswapFactory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    sushiswapFactory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
};

const uniV2Factory = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)',
    'function allPairs(uint) external view returns (address pair)',
    'function allPairsLength() external view returns (uint)',
];

const account = getAccount('http', 'ETH');
const sushiswapFactory = new ethers.Contract(addresses.sushiswapFactory, uniV2Factory, account);

const allPairsLength = (await sushiswapFactory.allPairsLength()).toNumber();

let promises = [];
for (let i = 0; i < allPairsLength; i++) {
    promises.push(sushiswapFactory.allPairs(i));
}

let pairs = await Promise.all(promises);

console.log(pairs);
