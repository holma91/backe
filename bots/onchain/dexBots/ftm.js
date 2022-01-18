import ethers from 'ethers';
import { MNEMONIC, FTM_WEBSOCKET } from '../env.js';
import { onPairCreated, uniV2Factory } from '../utils/utils.js';

const addresses = {
    spookyswapFactory: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
    spiritswapFactory: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
};

const knownTokens = {
    WFTM: { address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', inUSD: 3.2 },
    USDC: { address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', inUSD: 1.0 },
    fETH: { address: '0x658b0c7613e890ee50b8c4bc6a3f41ef411208ad', inUSD: 3330 },
    fBTC: { address: '0xe1146b9ac456fcbb60644c36fd3f868a9072fc6e', inUSD: 43100 },
    DAI: { address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', inUSD: 1.0 },
    MIM: { address: '0x82f0b8b456c1a451378467398982d4834b6829c1', inUSD: 1.0 },
};

const provider = new ethers.providers.WebSocketProvider(FTM_WEBSOCKET);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(provider);

const spookyswapFactory = new ethers.Contract(addresses.spookyswapFactory, uniV2Factory, account);
const spiritswapFactory = new ethers.Contract(addresses.spiritswapFactory, uniV2Factory, account);

console.log('fantom DEX sync started\nsupported dexes: SpookySwap, SpiritSwap');

spookyswapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    await onPairCreated(account, token0Address, token1Address, addressPair, 'FTM', 'spookyswap', knownTokens);
});

spiritswapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    await onPairCreated(account, token0Address, token1Address, addressPair, 'FTM', 'spiritswap', knownTokens);
});
