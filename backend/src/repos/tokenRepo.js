import pool from '../pool.js';
import toCamelCase from './utils/toCamelCase.js';

class TokenRepo {
    static async find() {
        const { rows } = await pool.query('select * from token;');
        return toCamelCase(rows);
    }

    // add chain field to token table, then do this
    // static async findByChainAndAddress(chain, address) {
    //     const { rows } = await pool.query('select * from token where chain = $1 and address = $2;', [chain.]);
    //     return toCamelCase(rows);
    // }
}

export default TokenRepo;
