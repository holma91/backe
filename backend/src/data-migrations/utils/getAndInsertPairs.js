import ethers from 'ethers';
import pool from '../../pool.js';

const getAndInsertPairs = async (account, factory, chain, dex, knownTokens) => {
    const allPairsLength = (await factory.allPairsLength()).toNumber();

    // get all pairs
    let promises = [];
    for (let i = 2200; i < allPairsLength; i++) {
        promises.push(getPairMetadata(account, factory, i, chain, dex));
    }
    let pairs = await Promise.all(promises);
    pairs = pairs.filter((pair) => pair.address !== undefined);

    // get current liquidity for all pairs
    promises = [];
    for (let i = 0; i < pairs.length; i++) {
        promises.push(getPairLiquidity(account, pairs[i], knownTokens));
    }
    pairs = await Promise.all(promises);

    // filter pairs on liquidity
    pairs = pairs.filter((pair) => pair.liquidityUSD >= 100000);

    // pairs is now all pairs that we care about from sushi on eth
    await insertPairsIntoDB(pairs);
};

const insertPairsIntoDB = async (pairs) => {
    await pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'lasse',
        user: 'alexander',
        password: '',
    });

    for (const pair of pairs) {
        try {
            await pool.query(
                `insert into liquidity_pair 
                    (chain, dex, pair_address, token0_address, token0_name, token0_symbol, 
                    token0_decimals, token1_address, token1_name, token1_symbol, token1_decimals, 
                    liquidity_usd, updated_at)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now() at time zone 'utc') returning *;
                    `,
                [
                    pair.chain,
                    pair.dex,
                    pair.address,
                    pair.token0.address,
                    pair.token0.name,
                    pair.token0.symbol,
                    pair.token0.decimals,
                    pair.token1.address,
                    pair.token1.name,
                    pair.token1.symbol,
                    pair.token1.decimals,
                    pair.liquidityUSD,
                ]
            );
        } catch (e) {
            console.log(e);
        }
    }
    await pool.close();
};

const getPairLiquidity = async (account, pair, knownTokens) => {
    let knownAddresses = Object.values(knownTokens).map((token) => token.address.toLowerCase());
    const pairABI = [
        'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    ];
    const pairContract = new ethers.Contract(pair.address, pairABI, account);

    let reserves = await pairContract.getReserves();

    pair.token0.liq = 0;
    pair.token1.liq = 0;

    try {
        pair.token0.liq = ethers.utils.formatUnits(reserves['reserve0'], pair.token0.decimals);
        pair.token1.liq = ethers.utils.formatUnits(reserves['reserve1'], pair.token1.decimals);
    } catch (e) {
        console.log(e);
    }

    pair.liquidityUSD = 0;

    if (knownAddresses.includes(pair.token0.address.toLowerCase())) {
        pair.liquidityUSD = parseInt(pair.token0.liq) * knownTokens[pair.token0.symbol]['inUSD'];
    } else if (knownAddresses.includes(pair.token1.address.toLowerCase())) {
        pair.liquidityUSD = parseInt(pair.token1.liq) * knownTokens[pair.token1.symbol]['inUSD'];
    }

    return pair;
};

const getPairMetadata = async (account, factory, i, chain, dex) => {
    /*
        retrieves metadata about the pair and it's tokens
    */
    const pairInfoABI = [
        'function token0() external view returns (address)',
        'function token1() external view returns (address)',
        'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    ];

    const pairAddress = await factory.allPairs(i);
    const pairContract = new ethers.Contract(pairAddress, pairInfoABI, account);

    let token0 = {};
    let token1 = {};

    [token0.address, token1.address] = await Promise.all([pairContract.token0(), pairContract.token1()]);

    const tokenInfoABI = [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() public view returns (uint8)',
    ];

    let token0Contract = new ethers.Contract(token0.address, tokenInfoABI, account);
    let token1Contract = new ethers.Contract(token1.address, tokenInfoABI, account);

    try {
        [token0.name, token1.name, token0.symbol, token1.symbol, token0.decimals, token1.decimals] = await Promise.all([
            token0Contract.name(),
            token1Contract.name(),
            token0Contract.symbol(),
            token1Contract.symbol(),
            token0Contract.decimals(),
            token1Contract.decimals(),
        ]);
    } catch (e) {
        return { pairAddress: undefined };
    }

    return {
        chain,
        dex,
        address: pairAddress,
        token0,
        token1,
    };
};

export default getAndInsertPairs;
