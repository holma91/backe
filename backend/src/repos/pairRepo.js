import pool from '../pool.js';
import toCamelCase from './utils/toCamelCase.js';

class PairRepo {
    static async find() {
        const { rows } = await pool.query('select * from liquidity_pair;');
        return toCamelCase(rows);
    }

    static async findByChain(chain) {
        const { rows } = await pool.query('select * from liquidity_pair where chain = $1;', [chain.toUpperCase()]);
        return toCamelCase(rows);
    }

    static async findByChainAndDex(chain, dex) {
        const { rows } = await pool.query('select * from liquidity_pair where chain = $1 and dex = $2;', [
            chain.toUpperCase(),
            dex,
        ]);
        return toCamelCase(rows);
    }

    static async add(pair) {
        try {
            const { rows } = await pool.query(
                `insert into liquidity_pair 
                    (chain, dex, pair_address, token0_address, token0_name, token0_symbol, 
                    token0_decimals, token1_address, token1_name, token1_symbol, token1_decimals, 
                    liquidity_usd, created_at, updated_at)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now() at time zone 'utc') returning *;
                    `,
                [
                    pair.chain,
                    pair.dex,
                    pair.address.toLowerCase(),
                    pair.token0.address.toLowerCase(),
                    pair.token0.name,
                    pair.token0.symbol,
                    pair.token0.decimals,
                    pair.token1.address.toLowerCase(),
                    pair.token1.name,
                    pair.token1.symbol,
                    pair.token1.decimals,
                    pair.liquidityUSD,
                    pair.createdAt || null,
                ]
            );
            return toCamelCase(rows)[0];
        } catch (e) {
            console.log(e);
        }
    }
}

export default PairRepo;
