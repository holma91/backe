import express from 'express';
import TradeRepo from '../repos/tradeRepo.js';
import sendNotifications from './utils/sendNotifications.js';
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

    const trade = await TradeRepo.add(req.body);
    res.send(trade);
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
