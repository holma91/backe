import express from 'express';
import TwitterRepo from '../repos/twitterRepo.js';

const router = express.Router();

router.get('/ticker-mentions', async (req, res) => {
    const mentions = await TwitterRepo.findTickerMentions();

    res.send(mentions);
});

router.get('/tokens', async (req, res) => {
    const tokens = await TwitterRepo.findTokens();

    res.send(tokens);
});

router.get('/accounts', async (req, res) => {
    const accounts = await TwitterRepo.find();

    res.send(accounts);
});

router.get('/accounts/:username', async (req, res) => {
    const { username } = req.params;

    const account = await TwitterRepo.findByUsername(username, req.query['include_followers']);

    if (account) {
        res.send(account);
    } else {
        res.sendStatus(404);
    }
});

router.get('/accounts', async (req, res) => {
    const accounts = await TwitterRepo.find(req.query['only-ranked']);

    res.send(accounts);
});

export default router;
