import pool from '../pool.js';
import toCamelCase from './utils/toCamelCase.js';

class AccountRepo {
    static async find() {
        const { rows } = await pool.query('select * from account;');
        return toCamelCase(rows);
    }

    static async findByAddress(address, includeLabels) {
        let res;
        if (includeLabels === 'yes') {
            res = await pool.query(
                'select * from account as a join account_label as al on al.address = a.address where a.address = $1;',
                [address]
            );
        } else {
            res = await pool.query('select * from account where address = $1;', [address]);
        }
        return toCamelCase(res.rows)[0];
    }
}

export default AccountRepo;
