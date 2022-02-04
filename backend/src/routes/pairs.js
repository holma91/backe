import express from 'express';
import PairRepo from '../repos/pairRepo.js';
import sendNotifications from './utils/sendNotifications.js';
import schemas from './utils/requestSchemas.js';
import validator from 'jsonschema';
const validate = validator.validate;

// var accountSchema = {
//     // id: '/SimplePerson',
//     type: 'object',
//     properties: {
//         address: { type: 'string' },
//         account_type: { type: 'string' },
//     },
//     required: ['address', 'account_type'],
//     additionalProperties: false,
// };

// var account = {
//     address: '0xblahblahblah',
//     account_type: 'EOA',
// };

// v.addSchema(addressSchema, '/SimpleAddress');
// console.log(validate(account, accountSchema));

const router = express.Router();

router.get('/pairs', async (req, res) => {
    const pairs = await PairRepo.find();

    res.send(pairs);
});

router.get('/pairs/:chain', async (req, res) => {
    const { chain } = req.params;

    const pairs = await PairRepo.findByChain(chain);

    res.send(pairs);
});

router.get('/pairs/:chain/:dex', async (req, res) => {
    const { chain, dex } = req.params;
    console.log('aghhhhhhhh');

    const pairs = await PairRepo.findByChainAndDex(chain, dex);

    res.send(pairs);
});

router.post('/pairs', async (req, res) => {
    const validation = validate(req.body, schemas.pair);
    if (validation.errors.length > 0) {
        return res.status(400).send({ messages: validation.errors.map((error) => error.stack) });
    }

    // sendNotifications(req.body);

    const pair = await PairRepo.add(req.body);
    res.send(pair);
});

router.post('/test', async (req, res) => {
    console.log(req.body);
    const validation = validate(req.body, schemas.pair);
    if (validation.errors.length > 0) {
        return res.status(400).send({ messages: validation.errors.map((error) => error.stack) });
    }

    res.send('success');
});

export default router;
