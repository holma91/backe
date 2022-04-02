import { ethers } from 'ethers';
import { getProvider, uniV2Factory } from './utils.js';

const provider = getProvider('http', 'DFK');
const factoryContractAddress = '0x794C07912474351b3134E6D6B3B7b3b4A07cbAAa';
const crystalvaleFactory = new ethers.Contract(factoryContractAddress, uniV2Factory, provider);

crystalvaleFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    console.log(`
    ~~~~~~~~~~~~~~~~~~
    New pair detected
    ~~~~~~~~~~~~~~~~~~
    token0: ${token0Address}
    token1: ${token1Address}
    addressPair: ${addressPair}
    `);
});
