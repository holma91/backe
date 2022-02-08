// get every dex
// get every pair at each dex
// listen to every pair from each dex

import { getAccount } from '../utils/utils.js';
import { ethers } from 'ethers';
const addresses = {
    pancakeswapFactory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
};

const uniV2Factory = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)',
    'function allPairs(uint) external view returns (address pair)',
    'function allPairsLength() external view returns (uint)',
];

const account = getAccount('http', 'BSC');

const pancakeswapFactory = new ethers.Contract(addresses.pancakeswapFactory, uniV2Factory, account);

const allPairsLength = (await pancakeswapFactory.allPairsLength()).toNumber();

let promises = [];
for (let i = 0; i < allPairsLength; i++) {
    promises.push(pancakeswapFactory.allPairs(i));
}

let pairs = await Promise.all(promises);

console.log(pairs);
