import ethers from 'ethers';
import { MNEMONIC, BSC_WEBSOCKET } from '../env.js';
import { onPairCreated, uniV2Factory } from '../utils/utils.js';

const addresses = {
    pancakeSwapFactory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
};

const established_tokenAddresses = {
    WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
};

const provider = new ethers.providers.WebSocketProvider(BSC_WEBSOCKET);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(provider);

const pancakeSwapFactory = new ethers.Contract(addresses.pancakeSwapFactory, uniV2Factory, account);

console.log('binance smart chain DEX sync started\nsupported dexes: PancakeSwap');

let receivedPairs = 0;
let displayedPairs = 0;
pancakeSwapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    receivedPairs++;
    console.log(`NEW PAIR ${addressPair}, receivedPairs = ${receivedPairs}`);
    await onPairCreated(
        account,
        token0Address,
        token1Address,
        addressPair,
        'BSC',
        'pancakeswap',
        established_tokenAddresses
    );
    displayedPairs++;
    console.log(`DISPLAYED PAIR ${addressPair}, displayedPairs = ${displayedPairs}`);
});
