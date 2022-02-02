import ethers from 'ethers';
import { getAccount, uniV2Pair } from '../utils/utils.js';
import toCamelCase from '../utils/toCamelCase.js';
import Pool from '../pool.js';

const setUpPair = (pair, account) => {
    console.log(`setting up pair no ${pair.pairId} with address ${pair.pairAddress}`);
    const pairContract = new ethers.Contract(pair.pairAddress, uniV2Pair, account);

    pairContract.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
        // are sender and/or to interesting?
        console.log(`
            pair: ${pair.pairAddress}
            pairId: ${pair.pairId}
            token0: ${pair.token0Symbol}
            token1: ${pair.token1Symbol}
            sender: ${sender}
            amount0In: ${amount0In}
            amount1In: ${amount1In}
            amount0Out: ${amount0Out}
            amount1Out: ${amount1Out}
            to: ${to}
        `);
    });
};

const main = async () => {
    const pool = new Pool();
    pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'lasse',
        user: 'alexander',
        password: '',
    });

    // get all liq pairs
    const res = await pool.query('select * from liquidity_pair where chain = $1 and dex = $2', ['ETH', 'sushiswap']);
    let pairs = toCamelCase(res.rows);

    const account = getAccount('http', 'ETH');

    for (const pair of pairs) {
        setUpPair(pair, account);
    }

    pool.close();
};

await main();
