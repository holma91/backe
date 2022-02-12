import ethers from 'ethers';
import { getAccount, uniV2Factory } from '../utils/utils.js';

const addresses = {
    fusefiFactory: '0x1d1f1a7280d67246665bb196f38553b469294f3a',
};

const knownTokens = {
    FUSE: { address: '0x970b9bb2c0444f5e81e9d0efb84c8ccdcdcaf84d', inUSD: 0.7 },
    WFUSE: { address: '0x0be9e53fd7edac9f859882afdda116645287c629', inUSD: 0.7 },
    FUSD: { address: '0x249be57637d8b013ad64785404b24aebae9b098b', inUSD: 1 },
    BUSD: { address: '0x6a5f6a8121592becd6747a38d67451b310f7f156', inUSD: 1 },
    USDC: { address: '0x620fd5fa44be6af63715ef4e65ddfa0387ad13f5', inUSD: 1 },
    USDT: { address: '0xfadbbf8ce7d5b7041be672561bba99f79c532e10', inUSD: 1 },
};

const account = getAccount('http', 'FUSE');

const fusefi = {
    factory: new ethers.Contract(addresses.fusefiFactory, uniV2Factory, account),
    account: account,
    knownTokens: knownTokens,
    dexName: 'fusefi',
    chainName: 'FUSE',
};

export { fusefi };
