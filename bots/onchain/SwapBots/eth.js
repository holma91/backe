import { getAccount } from '../utils/utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';
import WebSocket from 'ws';
import 'dotenv/config';
import setUpPair from './tracker.js';

const stablecoins = {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
        address: 'USDC',
        usdValue: new Big(1.0),
    },
    '0xdac17f958d2ee523a2206206994597c13d831ec7': {
        symbol: 'USDT',
        usdValue: new Big(1.0),
    },
    '0x6b175474e89094c44da98b954eedeac495271d0f': {
        symbol: 'DAI',
        usdValue: new Big(1.0),
    },
    '0x4fabb145d64652a948d72533023f6e7a623c7c53': {
        symbol: 'BUSD',
        usdValue: new Big(1.0),
    },
};

const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const main = async () => {
    const response = await fetch('http://localhost:3005/pairs/eth/');
    let pairs = await response.json();

    const account = getAccount('http', 'ETH');

    for (const pair of pairs) {
        setUpPair(pair, account, WETH, stablecoins);
    }

    const ws = new WebSocket('ws://localhost:8080/');

    ws.on('open', function open() {
        ws.send('socket opened succesfully in ethereum tracker');
    });

    ws.on('message', function message(msg) {
        try {
            const pair = JSON.parse(msg);
            if (pair.chain === 'ETH') {
                setUpPair(pair, account, WETH, stablecoins);
            }
        } catch (e) {
            console.log(e);
            console.log(msg.toString());
        }
    });
};

await main();
