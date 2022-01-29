// how do I follow addresses?

// - alchemy webhooks (only works on eth)
// - check every new block, if stuff happening then query etherscan to see if we have a new swap
// https://medium.com/coinmonks/monitoring-an-ethereum-address-with-web3-js-970c0a3cf96d
// approach 2:
// 1. wait for new block
// 2. go through all txs, finds address x
// 3. query etherscan for the latest ttes from x
// 4. if there was a swap, find it by comparing block heights

import ethers from 'ethers';
import fetch from 'node-fetch';

const provider = new ethers.providers.JsonRpcProvider(
    'https://eth-ropsten.alchemyapi.io/v2/VMq6K7b9MLmchJCB5hkgRdiYKEoY2Qqx'
);

// let blockNumber = await provider.getBlockNumber();
// let block = await provider.getBlockWithTransactions(blockNumber);
// for (let i = 0; i < 50; i++) {
//     try {
//         let response = await fetch(
//             'https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=0xdcb9048d6bb9c31e60af7595ef597adc642b9cb6&startblock=11877852&endblock=999999999&sort=asc&apikey=FJVSJ3Q8PD233E51ZPCPI6EGZRVZKFCD5C'
//         );
//         let data = await response.json();
//         console.log(data['status']);
//     } catch (e) {
//         console.log(i);
//         console.log(e);
//     }
// }

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

for (let i = 0; i < 10; i++) {
    console.log(i);
    await sleep(2000);
}