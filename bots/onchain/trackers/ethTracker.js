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
import { MNEMONIC, ETH_HTTP } from '../env.js';

const provider = new ethers.providers.JsonRpcProvider(ETH_HTTP);
//const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
//const account = wallet.connect(provider);
let blockNumber = await provider.getBlockNumber();
let block = await provider.getBlockWithTransactions(blockNumber);
console.log(block);
console.log(blockNumber);
