import ethers from 'ethers';
import { getProvider, uniV2Factory } from '../utils.js';

const addresses = {
    traderjoeFactory: '0x9ad6c38be94206ca50bb0d90783181662f0cfa10',
    pangolinFactory: '0xefa94de7a4656d787667c749f7e1223d71e9fd88',
};

const knownTokens = {
    WAVAX: { address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', inUSD: 86 },
    USDC: { address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', inUSD: 1 },
    USDCe: { address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664', inUSD: 1 },
    USDT: { address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7', inUSD: 1 },
    USDTe: { address: '0xc7198437980c041c805a1edcba50c1ce5db95118', inUSD: 1 },
};

const provider = getProvider('http', 'AVAX');

const traderjoe = {
    factory: new ethers.Contract(addresses.traderjoeFactory, uniV2Factory, provider),
    provider,
    knownTokens,
    dexName: 'traderjoe',
    chainName: 'AVAX',
};

const pangolin = {
    factory: new ethers.Contract(addresses.pangolinFactory, uniV2Factory, provider),
    provider,
    knownTokens,
    dexName: 'pangolin',
    chainName: 'AVAX',
};

export { traderjoe, pangolin };
