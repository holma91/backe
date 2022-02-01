import Pool from './pool.js';

const pool = new Pool();
pool.connect({
    host: 'localhost',
    port: 5432,
    database: 'lasse',
    user: 'alexander',
    password: '',
});

let res = await pool.query(
    `insert into liquidity_pair 
        (chain, dex, pair_id, pair_address, token0_address, token0_name, token0_symbol, 
        token0_decimals, token1_address, token1_name, token1_symbol, token1_decimals)
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *;
        `,
    [
        'eth',
        'sushiswap',
        '0',
        '0x0463a06fbc8bf28b3f120cd1bfc59483f099d332',
        '0x0463a06fbc8bf28b3f120cd1bfc59483f099d332',
        'ad',
        'asd',
        '12',
        '0x0463a06fbc8bf28b3f120cd1bfc59483f099d332',
        'ame',
        'a',
        '19',
    ]
);

console.log(res.rows);
