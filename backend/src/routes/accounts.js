import express from 'express';
import AccountRepo from '../repos/accountRepo.js';

const router = express.Router();

router.get('/accounts', async (req, res) => {
    const accounts = await AccountRepo.find(req.query['include_labels']);

    res.send(accounts);
});

router.get('/accounts/:address', async (req, res) => {
    const { address } = req.params;

    const account = await AccountRepo.findByAddress(address, req.query['include_labels']);

    if (account) {
        res.send(account);
    } else {
        res.sendStatus(404);
    }
});

export default router;
