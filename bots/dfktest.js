import { getProvider, uniV2Pair } from './utils.js';
import { ethers } from 'ethers';

const provider = getProvider('http', 'DFK');

// console.log(provider);

const pairContractAddress = '0x04Dec678825b8DfD2D0d9bD83B538bE3fbDA2926';

const pairContract = new ethers.Contract(pairContractAddress, uniV2Pair, provider);

pairContract.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
    console.log(`
    sender: ${sender}
    amount0In: ${amount0In}
    amount1In: ${amount1In}
    amount0Out: ${amount0Out}
    amount1Out: ${amount1Out}
    to: ${to}
    `);
});
