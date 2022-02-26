import express from 'express';
import TwitterRepo from '../repos/TwitterRepo.js';

const router = express.Router();

router.get('/twitter/accounts', async (req, res) => {
    const accounts = await TwitterRepo.find(req.query['only-ranked']);

    res.send(accounts);
});

router.get('/twitter/accounts/:username', async (req, res) => {
    const { username } = req.params;

    const account = await TwitterRepo.findByUsername(username);

    if (account) {
        res.send(account);
    } else {
        res.sendStatus(404);
    }
});

export default router;
