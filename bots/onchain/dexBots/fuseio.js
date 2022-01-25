import ethers from 'ethers';
import { MNEMONIC } from '../env.js';
import connections from '../connections.js';
const { FUSE } = connections;
import { uniV2Factory } from '../utils/utils.js';

const addresses = {
    fusefiFactory: '0x1d1f1A7280D67246665Bb196F38553b469294f3a',
};

const knownTokens = {
    FUSE: { address: '0x970b9bb2c0444f5e81e9d0efb84c8ccdcdcaf84d', inUSD: 1.1 },
    WFUSE: { address: '0x0BE9e53fd7EDaC9F859882AfdDa116645287C629', inUSD: 1.1 },
    FUSD: { address: '0x249BE57637D8B013Ad64785404b24aeBaE9B098B', inUSD: 1.0 },
    BUSD: { address: '0x6a5F6A8121592BeCd6747a38d67451B310F7f156', inUSD: 1.0 },
    USDC: { address: '0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5', inUSD: 1.0 },
    USDT: { address: '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10', inUSD: 1.0 },
};

const provider = new ethers.providers.JsonRpcProvider(FUSE.http);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(provider);

const fusefi = {
    factory: new ethers.Contract(addresses.fusefiFactory, uniV2Factory, account),
    account: account,
    knownTokens: knownTokens,
    dexName: 'fusefi',
    chainName: 'FUSE',
};

export { fusefi };
