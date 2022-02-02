import Pool from './pool.js';
const pool = new Pool();
pool.connect({
    host: 'localhost',
    port: 5432,
    database: 'lasse',
    user: 'alexander',
    password: '',
});
let res = await pool.query('select * from liquidity_pair where chain = $1 and dex = $2', ['ETH', 'sushiswap']);

console.log(res.rows);
pool.close();
