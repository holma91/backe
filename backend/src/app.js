import express from 'express';
import accountsRouter from './routes/accounts.js';
import pairsRouter from './routes/pairs.js';

const app = () => {
    const app = express();

    app.use(express.json());
    app.use(accountsRouter);
    app.use(pairsRouter);

    return app;
};

export default app;

// DATABASE_URL=postgresql://alexander:@localhost:5432/lasse npm run migrate up
