import pool from '../pool.js';
import toCamelCase from './utils/toCamelCase.js';

class UserRepo {
    static async find() {
        const { rows } = await pool.query('select * from users;');
        return toCamelCase(rows);
    }

    static async findById(id) {
        const { rows } = await pool.query('select * from users where id = $1;', [id]);
        return toCamelCase(rows)[0];
    }
}

export default UserRepo;
