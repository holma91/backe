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
        [token0.name, token0.name, token0.symbol, token1.symbol, token0.decimals, token1.decimals] = await Promise.all([
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
        pairId: i,
        pairAddress: pairAddress,
        token0: token0,
        token1: token1,
    };
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

    let promises = [];
    for (let i = 0; i < sushiAllPairsLength; i++) {
        promises.push(getPairMetadata(account, sushiswapFactory, i));
    }
    let pairs = await Promise.all(promises);
    console.log(pairs.length);
    pairs = pairs.filter((pair) => pair.pairAddress !== undefined);
    console.log(pairs.length);
};

await main();

// const getPairLiquidity = async (addressPair, account) => {
//     const pairContract = new ethers.Contract(
//         addressPair,
//         [
//             'function token0() external view returns (address)',
//             'function token1() external view returns (address)',
//             'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
//         ],
//         account
//     );

//     let token0 = await pairContract.token0();
//     let token1 = await pairContract.token1();

//     let success = false;
//     let count = 0;
//     let reserves;

//     while (!success) {
//         try {
//             count++;
//             reserves = await pairContract.getReserves();
//             success = true;
//         } catch (e) {
//             await sleep(1000);
//             if (count > 15) break;
//         }
//     }

//     let liq0 = 0;
//     let liq1 = 0;

//     try {
//         liq0 = ethers.utils.formatUnits(reserves['reserve0'], token0Decimals);
//         liq1 = ethers.utils.formatUnits(reserves['reserve1'], token1Decimals);
//     } catch (e) {
//         console.log(`could not find liquidity for tokens in the pair with address ${addressPair}`);
//         console.log(e);
//     }

//     return { liq0, liq1 };
// };
