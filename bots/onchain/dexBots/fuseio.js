import ethers from 'ethers';
import { MNEMONIC, FUSE_HTTP } from '../env.js';
import { uniV2Factory, onPairCreated } from '../utils/utils.js';

const addresses = {
    fuseswapFactory: '0x1d1f1A7280D67246665Bb196F38553b469294f3a',
};

const knownTokens = {
    FUSE: { address: '0x970b9bb2c0444f5e81e9d0efb84c8ccdcdcaf84d', inUSD: 1.6 },
    WFUSE: { address: '0x0BE9e53fd7EDaC9F859882AfdDa116645287C629', inUSD: 1.6 },
    FUSD: { address: '0x249BE57637D8B013Ad64785404b24aeBaE9B098B', inUSD: 1.0 },
    BUSD: { address: '0x6a5F6A8121592BeCd6747a38d67451B310F7f156', inUSD: 1.0 },
    USDC: { address: '0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5', inUSD: 1.0 },
    USDT: { address: '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10', inUSD: 1.0 },
};

const provider = new ethers.providers.JsonRpcProvider(FUSE_HTTP);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(provider);

const fuseswapFactory = new ethers.Contract(addresses.fuseswapFactory, uniV2Factory, account);

console.log('fuse DEX sync started\nsupported dexes: fuse.fi');

let receivedPairs = 0;
let displayedPairs = 0;
fuseswapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    receivedPairs++;
    console.log(`NEW PAIR ${addressPair}, receivedPairs = ${receivedPairs}`);
    await onPairCreated(account, token0Address, token1Address, addressPair, 'FUSE', 'fuse.fi', knownTokens);
    displayedPairs++;
    console.log(`DISPLAYED PAIR ${addressPair}, displayedPairs = ${displayedPairs}`);
});
