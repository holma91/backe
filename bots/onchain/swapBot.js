import { getAccount } from './utils/utils.js';
import fetch from 'node-fetch';
import Big from 'big.js';
import WebSocket from 'ws';
import 'dotenv/config';
import setUpPair from './SwapBots/tracker.js';

const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;

const stablecoins = {
    ETH: {
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
    },
    BSC: {
        '0xe9e7cea3dedca5984780bafc599bd69add087d56': {
            address: 'BUSD',
            usdValue: new Big(1.0),
        },
        '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': {
            symbol: 'USDC',
            usdValue: new Big(1.0),
        },
    },
    OPTIMISM: {
        '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58': {
            symbol: 'USDT',
            usdValue: new Big(1.0),
        },
        '0x7f5c764cbc14f9669b88837ca1490cca17c31607': {
            symbol: 'USDC',
            usdValue: new Big(1.0),
        },
        '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': {
            symbol: 'DAI',
            usdValue: new Big(1.0),
        },
    },
};

const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const WBNB = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
const WETH_optimism = '0x4200000000000000000000000000000000000006';

const getPairs = async (chain) => {
    const response = await fetch(`${URL}/pairs/${chain}/`);
    let pairs = await response.json();
    return pairs;
};

const setUpPairs = async (chain) => {};

const main = async () => {
    const ethPairs = await getPairs('ETH');
    const ethAccount = getAccount('http', 'ETH');

    const bscPairs = await getPairs('BSC');
    const bscAccount = getAccount('http', 'BSC');

    const optimismPairs = await getPairs('OPTIMISM');
    const optimismAccount = getAccount('http', 'OPTIMISM');

    let chain = {
        pairs: ethPairs,
        account: ethAccount,
        nativeTokenAddress: WETH,
        stablecoins: stablecoins.ETH,
    };

    // nativetoken and stables

    for (const pair of ethPairs) {
        setUpPair(pair, ethAccount, WETH, stablecoins.ETH);
    }

    for (const pair of bscPairs) {
        setUpPair(pair, bscAccount, WBNB, stablecoins.BSC);
    }

    for (const pair of optimismPairs) {
        setUpPair(pair, optimismAccount, WETH_optimism, stablecoins.OPTIMISM);
    }

    const ws = new WebSocket('ws://localhost:8080/');

    ws.on('open', function open() {
        ws.send('socket opened succesfully in multi tracker');
    });

    ws.on('message', function message(msg) {
        try {
            const pair = JSON.parse(msg);
            if (pair.chain === 'ETH') {
                setUpPair(pair, ethAccount, WETH, stablecoins.ETH);
            } else if (pair.chain === 'BSC') {
                setUpPair(pair, bscAccount, WBNB, stablecoins.BNB);
            }
        } catch (e) {
            console.log(e);
            console.log(msg.toString());
        }
    });
};

await main();
