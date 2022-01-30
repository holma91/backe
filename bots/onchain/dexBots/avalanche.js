import ethers from 'ethers';
import { getAccount, uniV2Factory } from '../utils/utils.js';

const addresses = {
    traderjoeFactory: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10',
    pangolinFactory: '0xefa94DE7a4656D787667C749f7E1223D71E9FD88',
};

const knownTokens = {
    WAVAX: {
        address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
        inUSD: 65,
    },
    USDC: {
        address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
        inUSD: 1.0,
    },
    USDCe: {
        address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
        inUSD: 1.0,
    },
    USDT: {
        address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
        inUSD: 1.0,
    },
    USDTe: {
        address: '0xc7198437980c041c805a1edcba50c1ce5db95118',
        inUSD: 1.0,
    },
};

const account = getAccount('http', 'AVAX');

const traderjoe = {
    factory: new ethers.Contract(addresses.traderjoeFactory, uniV2Factory, account),
    account,
    knownTokens,
    dexName: 'traderjoe',
    chainName: 'AVAX',
};

const pangolin = {
    factory: new ethers.Contract(addresses.pangolinFactory, uniV2Factory, account),
    account,
    knownTokens,
    dexName: 'pangolin',
    chainName: 'AVAX',
};

export { traderjoe, pangolin };
