const app = require('./src/app');
// const pool = require('./src/pool');

pool.connect({
    host: 'localhost',
    port: 5432,
    database: 'lasse',
    user: 'alexander',
    password: '',
})
    .then(() => {
        app().listen(3005, () => {
            console.log('listening on port 3005');
        });
    })
    .catch((err) => console.error(err));
