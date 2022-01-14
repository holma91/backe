import ethers from 'ethers';
import { MNEMONIC, AVAX_WEBSOCKET } from '../env.js';
import { onPairCreated, uniV2Factory } from '../utils/utils.js';

const addresses = {
    traderjoeFactory: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10',
    pangolinFactory: '0xefa94DE7a4656D787667C749f7E1223D71E9FD88',
};

const established_tokenAddresses = {
    WAVAX: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    USDC: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    USDCe: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    USDT: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
    USDTe: '0xc7198437980c041c805a1edcba50c1ce5db95118',
};

const provider = new ethers.providers.WebSocketProvider(AVAX_WEBSOCKET);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(provider);

const traderjoeFactory = new ethers.Contract(addresses.traderjoeFactory, uniV2Factory, account);
const pangolinFactory = new ethers.Contract(addresses.pangolinFactory, uniV2Factory, account);

console.log('avalanche DEX sync started\nsupported dexes: TraderJoe, Pangolin');

let receivedPairs = 0;
let displayedPairs = 0;

traderjoeFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    receivedPairs++;
    console.log(`NEW PAIR ${addressPair}, receivedPairs = ${receivedPairs}`);
    await onPairCreated(
        account,
        token0Address,
        token1Address,
        addressPair,
        'AVAX',
        'traderjoe',
        established_tokenAddresses
    );
    displayedPairs++;
    console.log(`DISPLAYED PAIR ${addressPair}, displayedPairs = ${displayedPairs}`);
});

pangolinFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    receivedPairs++;
    console.log(`NEW PAIR ${addressPair}, receivedPairs = ${receivedPairs}`);
    await onPairCreated(
        account,
        token0Address,
        token1Address,
        addressPair,
        'AVAX',
        'pangolin',
        established_tokenAddresses
    );
    displayedPairs++;
    console.log(`DISPLAYED PAIR ${addressPair}, displayedPairs = ${displayedPairs}`);
});
