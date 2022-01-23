const express = require('express');
const accountsRouter = require('./routes/accounts');

module.exports = () => {
    const app = express();

    app.use(express.json());
    app.use(accountsRouter);

    return app;
};

// DATABASE_URL=postgresql://alexander:@localhost:5432/lasse npm run migrate up
