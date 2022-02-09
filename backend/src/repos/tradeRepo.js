import pool from '../pool.js';
import toCamelCase from './utils/toCamelCase.js';

class TradeRepo {
    static async find() {
        const { rows } = await pool.query('select * from trade;');
        return toCamelCase(rows);
    }

    // static async findByChain(chain) {
    //     const { rows } = await pool.query('select * from liquidity_pair where chain = $1;', [chain.toUpperCase()]);
    //     return toCamelCase(rows);
    // }

    // static async findByChainAndDex(chain, dex) {
    //     const { rows } = await pool.query('select * from liquidity_pair where chain = $1 and dex = $2;', [
    //         chain.toUpperCase(),
    //         dex,
    //     ]);
    //     return toCamelCase(rows);
    // }

    static async add(swap) {
        let trades = [];
        for (let i = 0; i < 2; i++) {
            let response = await pool.query(
                `insert into trade
                (chain, sender_address, pair_address, token_address, token_symbol, 
                    token_price, amount, on_coingecko, trade_timestamp, trade_order)
                values ($1, $2, $3, $4, $5, $6, $7, $8, now() at time zone 'utc', $9) returning *;
                    `,
                [
                    swap.chain,
                    swap.senderAddress.toLowerCase(),
                    swap.pairAddress.toLowerCase(),
                    swap[`token${i}`].address.toLowerCase(),
                    swap[`token${i}`].symbol,
                    swap[`token${i}`].priceUSD,
                    swap[`token${i}`].amount,
                    swap[`token${i}`].onCoingecko,
                    swap[`token${i}`].order,
                ]
            );
            trades[i] = toCamelCase(response.rows);
        }

        return trades;
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

export default TradeRepo;
