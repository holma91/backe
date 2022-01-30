import ethers from 'ethers';
import fetch from 'node-fetch';
import connections from '../connections.js';

// let res = await fetch('https://api.coingecko.com/api/v3/coins/tractor-joe');
// let res = await fetch('https://api.coingecko.com/api/v3/asset_platforms');
// let res = await fetch(
//     'https://api.coingecko.com/api/v3/coins/avalanche/contract/0x6e84a6216ea7dacc71ee8e6b0a5b7322eebc0fdd'
// );
// let data = await res.json();
// console.log(JSON.stringify(data));
let provider = new ethers.providers.JsonRpcProvider(connections.BSC.http);
let blockNumber = await provider.getBlockNumber();
console.log(blockNumber);
