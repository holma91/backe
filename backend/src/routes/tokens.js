import express from 'express';
import TokenRepo from '../repos/tokenRepo.js';

const router = express.Router();

router.get('/tokens', async (req, res) => {
    const tokens = await AccountRepo.find();

    res.send(tokens);
});

router.get('/tokens/:address', async (req, res) => {
    const { address } = req.params;

    const token = await TokenRepo.findByAddress(address, req.query['include_categories']);

    if (token) {
        res.send(token);
    } else {
        res.sendStatus(404);
    }
});

export default router;
