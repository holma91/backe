import pool from '../pool.js';
import toCamelCase from './utils/toCamelCase.js';

class TwitterRepo {
    static async find(onlyRanked) {
        let res;
        if (onlyRanked === 'yes') {
            res = await pool.query('select * from twitter_account where rank = 1;');
        } else {
            res = await pool.query('select * from twitter_account;');
        }
        return toCamelCase(res.rows);
    }

    static async findByUsername(username) {
        const res = await pool.query('select * from twitter_account where username = $1;', [username]);

        return toCamelCase(res.rows)[0];
    }
}

export default TwitterRepo;
