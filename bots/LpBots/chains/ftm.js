import ethers from 'ethers';
import { getProvider, uniV2Factory } from '../utils.js';

const addresses = {
    spookyswapFactory: '0x152ee697f2e276fa89e96742e9bb9ab1f2e61be3',
};

const knownTokens = {
    WFTM: { address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', inUSD: 2.1 },
    USDC: { address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', inUSD: 1 },
    fETH: {
        address: '0x658b0c7613e890ee50b8c4bc6a3f41ef411208ad',
        inUSD: 3200,
    },
    fBTC: {
        address: '0xe1146b9ac456fcbb60644c36fd3f868a9072fc6e',
        inUSD: 45000,
    },
    DAI: { address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', inUSD: 1 },
    MIM: { address: '0x82f0b8b456c1a451378467398982d4834b6829c1', inUSD: 1 },
};

const provider = getProvider('http', 'FTM');

const spookyswap = {
    factory: new ethers.Contract(addresses.spookyswapFactory, uniV2Factory, provider),
    provider,
    knownTokens,
    dexName: 'spookyswap',
    chainName: 'FTM',
};

export { spookyswap };
