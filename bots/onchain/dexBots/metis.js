import ethers from 'ethers';
import { MNEMONIC, METIS_WEBSOCKET } from '../env.js';
import { uniV2Factory, onPairCreated } from '../utils/utils.js';

const addresses = {
    netswapFactory: '0x70f51d68D16e8f9e418441280342BD43AC9Dff9f',
    tethysFactory: '0x2CdFB20205701FF01689461610C9F321D1d00F80',
};

const knownTokens = {
    METIS: { address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000', inUSD: 290 },
    WETH: { address: '0x420000000000000000000000000000000000000A', inUSD: 3350 },
    mUSDC: { address: '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21', inUSD: 1.0 },
    mUSDT: { address: '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC', inUSD: 1.0 },
};

const provider = new ethers.providers.JsonRpcProvider(METIS_WEBSOCKET);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(provider);

const netswapFactory = new ethers.Contract(addresses.netswapFactory, uniV2Factory, account);
const tethysFactory = new ethers.Contract(addresses.tethysFactory, uniV2Factory, account);

console.log('metis DEX sync started\nsupported dexes: netswap, tethys');

let receivedPairs = 0;
let displayedPairs = 0;
netswapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    receivedPairs++;
    console.log(`NEW PAIR ${addressPair}, receivedPairs = ${receivedPairs}`);
    await onPairCreated(account, token0Address, token1Address, addressPair, 'METIS', 'netswap', knownTokens);
    displayedPairs++;
    console.log(`DISPLAYED PAIR ${addressPair}, displayedPairs = ${displayedPairs}`);
});

tethysFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    receivedPairs++;
    console.log(`NEW PAIR ${addressPair}, receivedPairs = ${receivedPairs}`);
    await onPairCreated(account, token0Address, token1Address, addressPair, 'METIS', 'tethys', knownTokens);
    displayedPairs++;
    console.log(`DISPLAYED PAIR ${addressPair}, displayedPairs = ${displayedPairs}`);
});
