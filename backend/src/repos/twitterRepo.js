import pool from '../pool.js';
import toCamelCase from './utils/toCamelCase.js';

class TwitterRepo {
    static async find() {
        const res = await pool.query('select * from twitter_account;');

        return toCamelCase(res.rows);
    }

    static async findByUsername(username, includeFollowers) {
        let res;
        if (includeFollowers === 'yes') {
            res = await pool.query(
                `
                select ta.username, ta.rank, ta.twitter_id, tc.follower_id 
                from twitter_account ta 
                join twitter_connection tc on tc.followee_id = ta.twitter_id
                where ta.username = $1;
            `,
                [username]
            );
        } else {
            res = await pool.query('select * from twitter_account where username = $1;', [username]);
        }

        let rows = toCamelCase(res.rows);
        return {
            username: rows[0].username,
            rank: rows[0].rank,
            twitterId: rows[0].twitterId,
            followers: rows.map((row) => row.followerId),
        };
    }
}

export default TwitterRepo;
