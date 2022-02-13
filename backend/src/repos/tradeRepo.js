import pool from '../pool.js';
import toCamelCase from './utils/toCamelCase.js';

class TradeRepo {
    static async find(includeLabels) {
        let res;
        if (includeLabels === 'yes') {
            res = await pool.query(
                'select * from trade as t join account_label as al on al.address = t.sender_address;'
            );
        } else {
            res = await pool.query('select * from trade;');
        }
        return toCamelCase(res.rows);
    }

    static async findByAddress(address, includeLabels) {
        let res;
        if (includeLabels === 'yes') {
            res = await pool.query(
                'select * from trade as t join account_label as al on al.address = t.sender_address where sender_address = $1;',
                [address.toLowerCase()]
            );
        } else {
            res = await pool.query('select * from trade where sender_address = $1;', [address.toLowerCase()]);
        }
        return toCamelCase(res.rows);
    }

    static async add(swap) {
        try {
            const { rows } = await pool.query(
                `insert into trade
                (chain, sender_address, pair_address, token_address, token_symbol, 
                    token_price, amount, on_coingecko, trade_timestamp, trade_order)
                values ($1, $2, $3, $4, $5, $6, $7, $8, now() at time zone 'utc', $9) returning *;
                    `,
                [
                    swap.chain,
                    swap.senderAddress.toLowerCase(),
                    swap.pairAddress.toLowerCase(),
                    swap.token.address.toLowerCase(),
                    swap.token.symbol,
                    swap.token.priceUSD,
                    swap.token.amount,
                    swap.token.coingecko.exists,
                    swap.token.order,
                ]
            );

            return toCamelCase(rows);
        } catch (e) {
            console.log(e);
        }
    }
}

export default TradeRepo;
