import express from 'express';
import TradeRepo from '../repos/tradeRepo.js';
import sendTradeNotification from './utils/sendTradeNotification.js';
import schemas from './utils/requestSchemas.js';
import validator from 'jsonschema';
const validate = validator.validate;

const router = express.Router();

router.get('/', async (req, res) => {
    const trades = await TradeRepo.find(req.query['include_labels']);

    res.send(trades);
});

router.get('/:address', async (req, res) => {
    const trades = await TradeRepo.findByAddress(req.params.address, req.query['include_labels']);

    res.send(trades);
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const validation = validate(req.body, schemas.trade);
    if (validation.errors.length > 0) {
        return res.status(400).send({ messages: validation.errors.map((error) => error.stack) });
    }

    const trade0 = {
        chain: req.body.chain,
        dex: req.body.dex,
        senderAddress: req.body.senderAddress,
        senderLabel: req.body.senderLabel,
        pairAddress: req.body.pairAddress,
        pair: `${req.body.token0.symbol}/${req.body.token1.symbol}`,
        token: req.body.token0,
    };
    const trade1 = {
        chain: req.body.chain,
        dex: req.body.dex,
        senderAddress: req.body.senderAddress,
        senderLabel: req.body.senderLabel,
        pairAddress: req.body.pairAddress,
        pair: `${req.body.token0.symbol}/${req.body.token1.symbol}`,
        token: req.body.token1,
    };

    sendTradeNotification(trade0.token.order === 'buy' ? trade0 : trade1);

    const trades = await Promise.all([TradeRepo.add(trade0), TradeRepo.add(trade1)]);
    res.send(trades);
});

export default router;
