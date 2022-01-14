import ethers from 'ethers';
import { MNEMONIC, FTM_WEBSOCKET } from '../env.js';
import { onPairCreated, uniV2Factory } from '../utils/utils.js';

const addresses = {
    spookyswapFactory: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
    spiritswapFactory: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
};

const established_tokenAddresses = {
    WFTM: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    USDC: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
};

const provider = new ethers.providers.WebSocketProvider(FTM_WEBSOCKET);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(provider);

const spookyswapFactory = new ethers.Contract(addresses.spookyswapFactory, uniV2Factory, account);
const spiritswapFactory = new ethers.Contract(addresses.spiritswapFactory, uniV2Factory, account);

console.log('fantom DEX sync started\nsupported dexes: SpookySwap, SpiritSwap');

let receivedPairs = 0;
let displayedPairs = 0;
spookyswapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    receivedPairs++;
    console.log(`NEW PAIR ${addressPair}, receivedPairs = ${receivedPairs}`);
    await onPairCreated(
        account,
        token0Address,
        token1Address,
        addressPair,
        'FTM',
        'spookyswap',
        established_tokenAddresses
    );
    displayedPairs++;
    console.log(`DISPLAYED PAIR ${addressPair}, displayedPairs = ${displayedPairs}`);
});

spiritswapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    receivedPairs++;
    console.log(`NEW PAIR ${addressPair}, receivedPairs = ${receivedPairs}`);
    await onPairCreated(
        account,
        token0Address,
        token1Address,
        addressPair,
        'FTM',
        'spiritswap',
        established_tokenAddresses
    );
    displayedPairs++;
    console.log(`DISPLAYED PAIR ${addressPair}, displayedPairs = ${displayedPairs}`);
});
