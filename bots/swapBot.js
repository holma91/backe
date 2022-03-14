import { uniswapV2Dexes } from './SwapBots/index.js';
import WebSocket from 'ws';
import 'dotenv/config';
import fetch from 'node-fetch';
import setUpPair from './SwapBots/tracker.js';

const getInterestingAddresses = async () => {
    const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;
    const response = await fetch(`${URL}/accounts/`);
    const accounts = await response.json();
    return new Set(accounts.map((acc) => acc.address));
};

const main = async () => {
    let stablecoins = {};
    let providers = {};
    let nativeTokenAddresses = {}; // e.g for ethereum this will be {WETH: <weth-address>}

    // we have a collection of "interesting" addresses in the database
    const interestingAddresses = await getInterestingAddresses();

    for (const dex of uniswapV2Dexes) {
        stablecoins[dex.chain] = dex.stablecoins;
        nativeTokenAddresses[dex.chain] = dex.nativeTokenAddress;
        providers[dex.chain] = dex.provider;

        // set up a listener for every saved pair we have for this particular dex, e.g. WETH-USDC on uniswap V2
        for (const pair of dex.pairs) {
            setUpPair(pair, dex.provider, dex.nativeTokenAddress, dex.stablecoins, interestingAddresses);
        }
    }

    /*
    we also want a ws connection to our backend so when a new pair is added to the DB
    we want to notify our bot currently running here that there is a new pair we should listen to
    */

    const ws = new WebSocket('ws://localhost:8080/');
    ws.on('open', function open() {
        ws.send('socket opened succesfully in multi tracker');
    });

    ws.on('message', function message(msg) {
        try {
            const pair = JSON.parse(msg);
            setUpPair(
                pair,
                providers[pair.chain],
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
