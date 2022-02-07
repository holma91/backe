import fetch from 'node-fetch';
import ethers from 'ethers';
import { getAccount, getTokenMetadata } from './utils/utils.js';

const tokenInfoABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() public view returns (uint8)',
];

const account = getAccount('http', 'ETH');
// console.time('runningTime');
// for (let i = 0; i < 10; i++) {
//     let token = {};
//     let contract = new ethers.Contract('0x6b175474e89094c44da98b954eedeac495271d0f', tokenInfoABI, account);
//     token.name = await contract.name();
//     token.symbol = await contract.symbol();
//     token.decimals = await contract.decimals();
//     console.log(token);
// }
// console.timeEnd('runningTime');

// console.time('runningTime');
// for (let i = 0; i < 10; i++) {
//     let token = {};
//     let contract = new ethers.Contract('0x6b175474e89094c44da98b954eedeac495271d0f', tokenInfoABI, account);
//     let promises = [contract.name(), contract.symbol(), contract.decimals()];
//     [token.name, token.symbol, token.decimals] = await Promise.all(promises);
//     console.log(token);
// }
console.time('runningTime');
for (let i = 0; i < 10; i++) {
    let metadata = await getTokenMetadata('0x6b175474e89094c44da98b954eedeac495271d0f', account);
    console.log(metadata);
}
console.timeEnd('runningTime');
