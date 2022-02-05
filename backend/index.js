import app from './src/app.js';
import pool from './src/pool.js';
import 'dotenv/config';

pool.connect({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})
    .then(() => {
        app().listen(3005, () => {
            console.log('listening on port 3005');
        });
    })
    .catch((err) => console.error(err));
