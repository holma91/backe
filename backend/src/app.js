import express from 'express';
import cors from 'cors';
import accountsRouter from './routes/accounts.js';
import pairsRouter from './routes/pairs.js';
import tokensRouter from './routes/tokens.js';
import tradesRouter from './routes/trades.js';

const app = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use(accountsRouter);
    app.use(tokensRouter);
    app.use(pairsRouter);
    app.use(tradesRouter);

    return app;
};

export default app;

// DATABASE_URL=postgresql://alexander:@localhost:5432/lasse npm run migrate up
