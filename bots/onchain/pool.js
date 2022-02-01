import { createRequire } from 'module'; // Bring in the ability to create the 'require' method in es6 modules
const require = createRequire(import.meta.url); // construct the require method
const pg = require('pg');
// import pg from 'pg'

class Pool {
    _pool = null;

    connect(options) {
        this._pool = new pg.Pool(options);
        // this query just forces a connection
        return this._pool.query('SELECT 1 + 1;');
    }

    close() {
        return this._pool.end();
    }

    query(sql, params) {
        return this._pool.query(sql, params);
    }
}

// module.exports = new Pool();
export default Pool;
