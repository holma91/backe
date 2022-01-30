import ethers from 'ethers';
import { uniV2Factory, getAccount } from '../utils/utils.js';

const addresses = {
    pancakeSwapFactory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
};

const knownTokens = {
    WBNB: {
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        inUSD: 380.0,
    },
    BUSD: {
        address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        inUSD: 1.0,
    },
};

const account = getAccount('http', 'BSC');

const pancakeswap = {
    factory: new ethers.Contract(addresses.pancakeSwapFactory, uniV2Factory, account),
    account,
    knownTokens,
    dexName: 'pancakeswap',
    chainName: 'BSC',
};

export { pancakeswap };

// pancakeSwapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
//     await onPairCreated(account, token0Address, token1Address, addressPair, 'BSC', 'pancakeswap', knownTokens);

//     // const pancakeSwapPair = new ethers.Contract(addressPair, uniV2Pair, account);
//     // pairs.push(pancakeSwapPair);
//     // setUpPair(pancakeSwapPair, pairs.length);
// });

// // listen to transactions
// const setUpPair = (pair, i) => {
//     console.log(`setting up pair no ${i} with address ${pair.address}`);
//     pair.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
//         // are sender and/or to interesting?
//         console.log(`
//             pair: ${pair.address}
//             pairNumber: ${i}
//             sender: ${sender}
//             amount0In: ${amount0In}
//             amount1In: ${amount1In}
//             amount0Out: ${amount0Out}
//             amount1Out: ${amount1Out}
//             to: ${to}
//         `);
//     });
// };
