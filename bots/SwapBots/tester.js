import ethers from 'ethers';
import connections from '../connections.js';

import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3005/');

ws.on('open', function open() {
    ws.send('something');
});

ws.on('message', function message(msg) {
    try {
        console.log(JSON.parse(msg));
    } catch (e) {
        console.log(msg.toString());
    }
});
