// get every dex
// get every pair at each dex
// listen to every pair from each dex

import { getAccount } from '../utils/utils.js';
import { ethers } from 'ethers';
const addresses = {
    traderjoeFactory: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10',
    pangolinFactory: '0xefa94DE7a4656D787667C749f7E1223D71E9FD88',
};

const uniV2Factory = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)',
    'function allPairs(uint) external view returns (address pair)',
    'function allPairsLength() external view returns (uint)',
];

const account = getAccount('http', 'AVAX');
console.log(account);

const traderjoeFactory = new ethers.Contract(addresses.traderjoeFactory, uniV2Factory, account);

const allPairsLength = await traderjoeFactory.allPairsLength();
let pairs = [];
console.log(allPairsLength.toNumber());
console.log(pairs);
