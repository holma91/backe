import { uniswapV2Dexes, uniswapV3Dexes } from './SwapBots/index.js';
import WebSocket from 'ws';
import 'dotenv/config';
import setUpPair from './SwapBots/tracker.js';

const main = async () => {
    let stablecoins = {};
    let accounts = {};
    let nativeTokenAddresses = {};

    for (const dex of uniswapV2Dexes) {
        stablecoins[dex.chain] = dex.stablecoins;
        nativeTokenAddresses[dex.chain] = dex.nativeTokenAddress;
        accounts[dex.chain] = dex.account;
        for (const pair of dex.pairs) {
            setUpPair(pair, dex.account, dex.nativeTokenAddress, dex.stablecoins);
        }
    }

    const ws = new WebSocket('ws://localhost:8080/');

    ws.on('open', function open() {
        ws.send('socket opened succesfully in multi tracker');
    });

    ws.on('message', function message(msg) {
        try {
            const pair = JSON.parse(msg);
            setUpPair(pair, accounts[pair.chain], nativeTokenAddresses[pair.chain], stablecoins[pair.chain]);
        } catch (e) {
            console.log(e);
            console.log(msg.toString());
        }
    });
};

await main();
