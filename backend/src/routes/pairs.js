import express from 'express';
import PairRepo from '../repos/pairRepo.js';
import sendNotifications from './utils/sendNotifications.js';

const router = express.Router();

router.get('/pairs', async (req, res) => {
    const pairs = await PairRepo.find();

    res.send(pairs);
});

router.get('/pairs/:chain', async (req, res) => {
    const { chain } = req.params;

    const pairs = await PairRepo.findByChain(chain);

    res.send(pairs);
});

router.get('/pairs/:chain/:dex', async (req, res) => {
    const { chain, dex } = req.params;
    console.log('aghhhhhhhh');

    const pairs = await PairRepo.findByChainAndDex(chain, dex);

    res.send(pairs);
});

router.post('/pairs', async (req, res) => {
    // validate request
    // sendNotifications(req.body);

    const pair = await PairRepo.add(req.body);
    res.send(pair);
});

export default router;
