import express from 'express';
import AccountRepo from '../repos/accountRepo.js';

const router = express.Router();

router.get('/', async (req, res) => {
    let accounts;
    if (req.query['address']) {
        accounts = await AccountRepo.findByAddress(req.query['address']);
    } else {
        accounts = await AccountRepo.find();
    }

    res.send(accounts);
});

router.get('/stats', async (req, res) => {
    let accountWithStats;
    if (req.query['address']) {
        accountWithStats = await AccountRepo.findWithStatsByAddress(req.query['address']);
    } else {
        accountWithStats = await AccountRepo.findWithStats();
    }

    res.send(accountWithStats);
});

export default router;
