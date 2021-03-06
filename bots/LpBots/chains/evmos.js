import ethers from 'ethers';
import { getProvider, uniV2Factory } from '../utils.js';

const addresses = {
    diffusionFactory: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
};

// WEVMOS?
const knownTokens = {
    WBNB: { address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', inUSD: 410 },
    BUSD: { address: '0xe9e7cea3dedca5984780bafc599bd69add087d56', inUSD: 1 },
};

const provider = getProvider('http', 'EVMOS');

const diffusion = {
    factory: new ethers.Contract(addresses.diffusionFactory, uniV2Factory, provider),
    provider,
    knownTokens,
    dexName: 'diffusion',
    chainName: 'EVMOS',
};

export { diffusion };
