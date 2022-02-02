const pool = require('../pool');
const toCamelCase = require('./utils/toCamelCase');

class PairRepo {
    static async find() {
        const { rows } = await pool.query('select * from liquidity_pair;');
        return toCamelCase(rows);
    }

    static async add(pair) {
        const { rows } = await pool.query(
            `insert into liquidity_pair 
                (chain, dex, pair_address, token0_address, token0_name, token0_symbol, 
                token0_decimals, token1_address, token1_name, token1_symbol, token1_decimals)
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *;
                `,
            [
                pair.chain,
                pair.dex,
                pair.pairAddress,
                pair.token0Address,
                pair.token0Name,
                pair.token0Symbol,
                pair.token0Decimals,
                pair.token1Address,
                pair.token1Name,
                pair.token1Symbol,
                pair.token1Decimals,
            ]
        );

        return toCamelCase(rows);
    }

    // static async findByAddress(address, includeLabels) {
    //     let res;
    //     if (includeLabels === 'yes') {
    //         res = await pool.query(
    //             'select * from account as a join account_label as al on al.address = a.address where a.address = $1;',
    //             [address]
    //         );
    //     } else {
    //         res = await pool.query('select * from account where address = $1;', [address]);
    //     }
    //     return toCamelCase(res.rows)[0];
    // }
}

module.exports = PairRepo;
