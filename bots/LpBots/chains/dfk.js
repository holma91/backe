import ethers from 'ethers';
import { getProvider, uniV2Factory } from '../../utils.js';

const addresses = {
    crystalvaleFactory: '0x794C07912474351b3134E6D6B3B7b3b4A07cbAAa',
};

const knownTokens = {
    CRYSTAL: { address: '0x04b9dA42306B023f3572e106B11D82aAd9D32EBb', inUSD: 30 },
    xCRYSTAL: { address: '0x6e7185872bcdf3f7a6cbbe81356e50daffb002d2', inUSD: 30 },
    JEWEL: { address: '0x4f60a160D8C2DDdaAfe16FCC57566dB84D674BD6', inUSD: 90 },
    WJEWEL: { address: '0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260', inUSD: 10 },
    xJEWEL: { address: '0x77f2656d04E158f915bC22f07B779D94c1DC47Ff', inUSD: 10 },
    AVAX: { address: '0xB57B60DeBDB0b8172bb6316a9164bd3C695F133a', inUSD: 90 },
    USDC: { address: '0x3AD9DFE640E1A9Cc1D9B0948620820D975c3803a', inUSD: 90 },
};

const provider = getProvider('http', 'DFK');

const crystalvale = {
    factory: new ethers.Contract(addresses.crystalvaleFactory, uniV2Factory, provider),
    provider,
    knownTokens,
    dexName: 'crystalvale',
    chainName: 'DFK',
};

export { crystalvale };
