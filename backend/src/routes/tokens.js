import express from 'express';
import TokenRepo from '../repos/tokenRepo.js';

const router = express.Router();

router.get('/tokens', async (req, res) => {
    const tokens = await TokenRepo.find();

    res.send(tokens);
});

export default router;
