import { uniswapV2Dexes, uniswapV3Dexes } from './SwapBots/index.js';
import WebSocket from 'ws';
import 'dotenv/config';
import fetch from 'node-fetch';
import setUpPair from './SwapBots/tracker.js';

const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;

const getInterestingAddresses = async () => {
    const response = await fetch(`${URL}/accounts/`);
    const accounts = await response.json();
    return accounts.map((acc) => acc.address);
};

const main = async () => {
    let stablecoins = {};
    let accounts = {};
    let nativeTokenAddresses = {};

    const interestingAddresses = await getInterestingAddresses();

    for (const dex of uniswapV2Dexes) {
        stablecoins[dex.chain] = dex.stablecoins;
        nativeTokenAddresses[dex.chain] = dex.nativeTokenAddress;
        accounts[dex.chain] = dex.account;
        for (const pair of dex.pairs) {
            setUpPair(pair, dex.account, dex.nativeTokenAddress, dex.stablecoins, interestingAddresses);
        }
    }

    const ws = new WebSocket('ws://localhost:8080/');

    ws.on('open', function open() {
        ws.send('socket opened succesfully in multi tracker');
    });

    ws.on('message', function message(msg) {
        try {
            const pair = JSON.parse(msg);
            setUpPair(
                pair,
                accounts[pair.chain],
                nativeTokenAddresses[pair.chain],
                stablecoins[pair.chain],
                interestingAddresses
            );
        } catch (e) {
            console.log(e);
            console.log(msg.toString());
        }
    });
};

await main();
