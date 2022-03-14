import express from 'express';
import PairRepo from '../repos/pairRepo.js';
import sendLPNotification from './utils/sendLPNotification.js';
import schemas from './utils/requestSchemas.js';
import validator from 'jsonschema';
import ws from 'ws';
import 'dotenv/config';

const validate = validator.validate;

const router = express.Router();

// establish a ws connection so we can notify the frontend and the swapbot when receiving a new pair
const wss = new ws.WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
    ws.on('message', function message(msg) {
        console.log(msg.toString());
    });
});

router.get('/', async (_, res) => {
    const pairs = await PairRepo.find();
    res.send(pairs);
});

router.get('/:chain', async (req, res) => {
    const { chain } = req.params;
    const pairs = await PairRepo.findByChain(chain);

    res.send(pairs);
});

router.get('/:chain/:dex', async (req, res) => {
    const { chain, dex } = req.params;
    const pairs = await PairRepo.findByChainAndDex(chain, dex);

    res.send(pairs);
});

router.post('/', async (req, res) => {
    const validation = validate(req.body, schemas.pair);
    if (validation.errors.length > 0) {
        return res.status(400).send({ messages: validation.errors.map((error) => error.stack) });
    }
    if (process.env.environment === 'PROD') {
        // send a notification in the discord server
        sendLPNotification(req.body);
    }

    req.body.createdAt = new Date().toUTCString();

    const pair = await PairRepo.add(req.body);

    // notify the swapbot
    wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(pair));
        }
    });

    res.send(pair);
});

export default router;
