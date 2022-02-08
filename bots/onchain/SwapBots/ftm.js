// get every dex
// get every pair at each dex
// listen to every pair from each dex

import { getAccount } from '../utils/utils.js';
import { ethers } from 'ethers';
const addresses = {
    spookyswapFactory: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
    spiritswapFactory: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
};

const uniV2Factory = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)',
    'function allPairs(uint) external view returns (address pair)',
    'function allPairsLength() external view returns (uint)',
];

const account = getAccount('http', 'FTM');

const spookyswapFactory = new ethers.Contract(addresses.spookyswapFactory, uniV2Factory, account);

const allPairsLength = await spookyswapFactory.allPairsLength();
let pairs = [];
console.log(allPairsLength.toNumber());
console.log(pairs);
