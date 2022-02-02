import Pool from '../pool.js';
import { getAccount } from '../utils/utils.js';
import { ethers } from 'ethers';

const getPairMetadata = async (account, factory, i) => {
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
        chain: 'ETH',
        dex: 'sushiswap',
        pairAddress: pairAddress,
        token0: token0,
        token1: token1,
    };
};

const getPairLiquidity = async (account, pair) => {
    const knownTokens = {
        WETH: {
            address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            inUSD: 2500,
        },
        USDC: {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            inUSD: 1.0,
        },
        USDT: {
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            inUSD: 1.0,
        },
        DAI: {
            address: '0x6b175474e89094c44da98b954eedeac495271d0f',
            inUSD: 1.0,
        },
    };
    let knownAddresses = Object.values(knownTokens).map((token) => token.address.toLowerCase());
    const pairABI = [
        'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    ];
    const pairContract = new ethers.Contract(pair.pairAddress, pairABI, account);

    let reserves = await pairContract.getReserves();

    pair.token0.liq = 0;
    pair.token1.liq = 0;

    try {
        pair.token0.liq = ethers.utils.formatUnits(reserves['reserve0'], pair.token0.decimals);
        pair.token1.liq = ethers.utils.formatUnits(reserves['reserve1'], pair.token1.decimals);
    } catch (e) {
        console.log(e);
    }

    pair.liqUSD = 0;

    if (knownAddresses.includes(pair.token0.address.toLowerCase())) {
        pair.liqUSD = parseFloat(pair.token0.liq) * knownTokens[pair.token0.symbol]['inUSD'];
    } else if (knownAddresses.includes(pair.token1.address.toLowerCase())) {
        pair.liqUSD = parseFloat(pair.token1.liq) * knownTokens[pair.token1.symbol]['inUSD'];
    }

    return pair;
};

const insertPairsIntoDB = async (pairs) => {
    const pool = new Pool();
    pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'lasse',
        user: 'alexander',
        password: '',
    });

    for (const pair of pairs) {
        await pool.query(
            `insert into liquidity_pair 
                (chain, dex, pair_address, token0_address, token0_name, token0_symbol, 
                token0_decimals, token1_address, token1_name, token1_symbol, token1_decimals)
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
                `,
            [
                pair.chain,
                pair.dex,
                pair.pairAddress,
                pair.token0.address,
                pair.token0.name,
                pair.token0.symbol,
                pair.token0.decimals,
                pair.token1.address,
                pair.token1.name,
                pair.token1.symbol,
                pair.token1.decimals,
            ]
        );
    }

    pool.close();
};

const main = async () => {
    const addresses = {
        uniswapFactory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        sushiswapFactory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    };

    const factoryABI = [
        'function getPair(address tokenA, address tokenB) external view returns (address pair)',
        'function allPairs(uint) external view returns (address pair)',
        'function allPairsLength() external view returns (uint)',
    ];

    const account = getAccount('http', 'ETH');
    const sushiswapFactory = new ethers.Contract(addresses.sushiswapFactory, factoryABI, account);
    const sushiAllPairsLength = (await sushiswapFactory.allPairsLength()).toNumber();

    // get all pairs
    let promises = [];
    for (let i = 1000; i < sushiAllPairsLength; i++) {
        promises.push(getPairMetadata(account, sushiswapFactory, i));
    }
    let pairs = await Promise.all(promises);
    pairs = pairs.filter((pair) => pair.pairAddress !== undefined);

    // get current liquidity for all pairs
    promises = [];
    for (let i = 0; i < pairs.length; i++) {
        promises.push(getPairLiquidity(account, pairs[i]));
    }
    pairs = await Promise.all(promises);

    // filter pairs on liquidity
    pairs = pairs.filter((pair) => pair.liqUSD >= 100000);
    // console.log(JSON.stringify(pairs));

    // pairs is now all pairs that we care about from sushi on eth
    insertPairsIntoDB(pairs);
};

await main();
