import fetch from 'node-fetch';
import ethers from 'ethers';
import { getAccount } from './utils/utils.js';
// make 100 random api calls
// console.time('runningTime');
// for (let i = 0; i < 10; i++) {
//     let res = await fetch('http://numbersapi.com/random/math');
//     let fact = await res.text();
//     console.log(fact);
// }
// console.timeEnd('runningTime');
const tokenInfoABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() public view returns (uint8)',
];

const account = getAccount('http', 'ETH');
console.time('runningTime');
for (let i = 0; i < 30; i++) {
    let contract = new ethers.Contract('0x6b175474e89094c44da98b954eedeac495271d0f', tokenInfoABI, account);
    let name = await contract.name();
    console.log(name);
}
console.timeEnd('runningTime');
