import ethers from 'ethers';
import { MNEMONIC, BSC_WEBSOCKET } from '../env.js';
import { onPairCreated, uniV2Factory, uniV2Pair } from '../utils/utils.js';
import { WebhookClient } from 'discord.js';
import { config } from '../discord/config.js';
const { bscHookId, bscHookToken } = config;

const addresses = {
    pancakeSwapFactory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
};

const knownTokens = {
    WBNB: {
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        inUSD: 500.0,
    },
    BUSD: {
        address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        inUSD: 1.0,
    },
};

const provider = new ethers.providers.WebSocketProvider(BSC_WEBSOCKET);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(provider);

const pancakeSwapFactory = new ethers.Contract(addresses.pancakeSwapFactory, uniV2Factory, account);

const webhookClient = new WebhookClient({ id: bscHookId, token: bscHookToken });

console.log('binance smart chain DEX sync started\nsupported dexes: PancakeSwap');

let pairs = [];

pancakeSwapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    webhookClient.send({
        content: 'pair created',
        username: 'some-username',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
    });
    await onPairCreated(
        account,
        token0Address,
        token1Address,
        addressPair,
        'BSC',
        'pancakeswap',
        knownTokens,
        webhookClient
    );

    // const pancakeSwapPair = new ethers.Contract(addressPair, uniV2Pair, account);
    // pairs.push(pancakeSwapPair);
    // setUpPair(pancakeSwapPair, pairs.length);
});

// listen to transactions
const setUpPair = (pair, i) => {
    console.log(`setting up pair no ${i} with address ${pair.address}`);
    pair.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
        // are sender and/or to interesting?
        console.log(`
            pair: ${pair.address}
            pairNumber: ${i}
            sender: ${sender}
            amount0In: ${amount0In}
            amount1In: ${amount1In}
            amount0Out: ${amount0Out}
            amount1Out: ${amount1Out}
            to: ${to}
        `);
    });
};
