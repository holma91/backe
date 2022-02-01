import { createRequire } from 'module'; // Bring in the ability to create the 'require' method in es6 modules
const require = createRequire(import.meta.url); // construct the require method
const eth_addresses = require('./random_data/eth_addresses.json');
const bsc_addresses = require('./random_data/bsc_addresses.json');
const ftm_addresses = require('./random_data/ftm_addresses.json');
import evmTransactionTracker from './trackers/evmTransactionTracker.js';
import connections from './connections.js';
import 'dotenv/config';

const ETH = {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
};

const BSC = {
    name: 'binance-smart-chain',
    symbol: 'BSC',
    decimals: 18,
    address: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
};

const FTM = {
    name: 'fantom',
    symbol: 'FTM',
    decimals: 18,
    address: '0xffffffffffffffffffffffffffffffffffffffff',
};

let addys = [
    '0xdcb9048D6bb9C31e60af7595ef597ADC642B9cB6',
    '0x11d625109d9257c24d8a3ab8128c4a95a2cf5c31',
    '0x0f4ee9631f4be0a63756515141281a3e2b293bbe',
    '0x4deb3edd991cfd2fcdaa6dcfe5f1743f6e7d16a6',
    '0xe0a9efe32985cc306255b395a1bd06d21ccead42',
    '0xff2fbc735d33ae830f056107f1b551783ec4ed5b',
    '0xc53fc02d1412bda659647dd0f8807404e3eeb850',
    '0xc18406aa413b4d08c729e7312239c34e45c61197',
    '0x4d638adb8c07a78655e9ae88641c4202774e6584',
    '0x9762b1d716bb97735905996e013d61c140722249',
    '0x80d4230c0a68fc59cb264329d3a717fcaa472a13',
    '0x2a8f327085d733a3dba191b3647818415a84ff28',
    '0x0001005071007b00cf908145cbde238724005200',
    '0xb7da1d05e8046c422f8344b74ebab556cc324a94',
    '0x89627989c7483dade7f86949931a55f48b02827f',
    '0x42d4c197036bd9984ca652303e07dd29fa6bdb37',
    '0x2cab89d7b88eafeb4ecf2d64a5e198ee664d3c2d',
    '0xe61ca8d4e835cf7e1989beb76426fe01a1238e10',
    '0x442ddad80cc2870f276800a177351e0bc69aceb5',
    '0xe45c35eb5daa1980fc5bb80fb5298b0ade934ba6',
    '0x0e5a65c3660020f75c29c4665c5392bf6cb889f1',
    '0xd02c260f54997146c9028b2ac7144b11ce4c20a6',
    '0xc252a841af842a55b0f0b507f68f3864bf1c02b5',
    '0xceebc5c76c1c4329dee0d962b365cfa16e178a39',
    '0x0e5a65c3660020f75c29c4665c5392bf6cb889f1',
    '0xe45c35eb5daa1980fc5bb80fb5298b0ade934ba6',
    '0x442ddad80cc2870f276800a177351e0bc69aceb5',
    '0x18ee55cc36387db47c1a9808b979ceea5401c300',
];

// let txChecker1 = new evmTransactionTracker(
//     'https://eth-ropsten.alchemyapi.io/v2/VMq6K7b9MLmchJCB5hkgRdiYKEoY2Qqx',
//     ['0xdcb9048D6bb9C31e60af7595ef597ADC642B9cB6'],
//     connections.ETH.explorer.apikey,
//     'ROPSTEN',
//     ETH
// );

let txCheckerETH = new evmTransactionTracker(
    connections.ETH.http,
    Object.keys(eth_addresses),
    connections.ETH.explorer.apikey,
    'ETH',
    ETH
);
let txCheckerBSC = new evmTransactionTracker(
    connections.BSC.http,
    Object.keys(bsc_addresses),
    connections.BSC.explorer.apikey,
    'BSC',
    BSC
);
let txCheckerFTM = new evmTransactionTracker(
    connections.FTM.http,
    Object.keys(ftm_addresses),
    connections.FTM.explorer.apikey,
    'FTM',
    FTM
);

setInterval(() => {
    txCheckerETH.checkBlock();
}, 5000);

setInterval(() => {
    txCheckerBSC.checkBlock();
}, 2500);

// setInterval(() => {
//     txCheckerFTM.checkBlock();
// }, 1000);

// a problem is that ftms block explorer api updates super slow... fuck
