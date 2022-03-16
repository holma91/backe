import pool from '../pool.js';
import toCamelCase from './utils/toCamelCase.js';

class AccountRepo {
    static async find() {
        const res = await pool.query('select * from account;');
        return toCamelCase(res.rows);
    }

    static async findWithStats() {
        const res = await pool.query('select * from account_stats;');

        return toCamelCase(res.rows);
    }

    static async findWithStatsByAddress(address) {
        const res = await pool.query('select * from account_stats where account_stats.address = $1;', [address]);

        return toCamelCase(res.rows);
    }

    static async findByAddress(address) {
        const res = await pool.query('select * from account where address = $1;', [address]);
        return toCamelCase(res.rows)[0];
    }
}

export default AccountRepo;
