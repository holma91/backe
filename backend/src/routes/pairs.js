import express from 'express';
import PairRepo from '../repos/pairRepo.js';
import sendNotifications from './utils/sendNotifications.js';

const router = express.Router();

router.get('/pairs', async (req, res) => {
    const pairs = await PairRepo.find();

    res.send(pairs);
});

router.post('/pairs', async (req, res) => {
    // validate request
    // sendNotifications(req.body);

    const pair = await PairRepo.add(req.body);
    res.send(pair);
});

// router.get('/pairs/:address', async (req, res) => {
//     const { address } = req.params;

//     const pair = await pairRepo.findByAddress(address, req.query['include_categories']);

//     if (pair) {
//         res.send(pair);
//     } else {
//         res.sendStatus(404);
//     }
// });

export default router;
