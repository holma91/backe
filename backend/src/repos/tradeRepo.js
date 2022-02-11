import pool from '../pool.js';
import toCamelCase from './utils/toCamelCase.js';

class TradeRepo {
    static async find() {
        const { rows } = await pool.query('select * from trade;');
        return toCamelCase(rows);
    }

    static async add(swap) {
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
                swap.token.onCoingecko,
                swap.token.order,
            ]
        );

        return toCamelCase(rows);
    }
}

export default TradeRepo;
