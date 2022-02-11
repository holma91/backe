import express from 'express';
import TradeRepo from '../repos/tradeRepo.js';
// import sendTradeNotification from './utils/sendTradeNotification.js';
import schemas from './utils/requestSchemas.js';
import validator from 'jsonschema';
const validate = validator.validate;

const router = express.Router();

router.get('/trades', async (req, res) => {
    const trades = await TradeRepo.find();

    res.send(trades);
});

router.post('/trades', async (req, res) => {
    const validation = validate(req.body, schemas.trade);
    if (validation.errors.length > 0) {
        return res.status(400).send({ messages: validation.errors.map((error) => error.stack) });
    }

    console.log('trade:', req.body);

    // sendNotifications(req.body);
    // sendTradeNotification(req.body);
    const trade0 = {
        chain: req.body.chain,
        senderAddress: req.body.senderAddress,
        pairAddress: req.body.pairAddress,
        token: req.body.token0,
    };
    const trade1 = {
        chain: req.body.chain,
        senderAddress: req.body.senderAddress,
        pairAddress: req.body.pairAddress,
        token: req.body.token1,
    };

    const trades = await Promise.all([TradeRepo.add(trade0), TradeRepo.add(trade1)]);
    res.send(trades);
});

// router.post('/test', async (req, res) => {
//     console.log(req.body);
//     const validation = validate(req.body, schemas.pair);
//     if (validation.errors.length > 0) {
//         return res.status(400).send({ messages: validation.errors.map((error) => error.stack) });
//     }

//     res.send('success');
// });

export default router;
