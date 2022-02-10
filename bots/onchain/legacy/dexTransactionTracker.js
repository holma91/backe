// get every dex
// get every pair at each dex
// listen to every pair from each dex

import { getAccount } from '../utils/utils.js';
import { ethers } from 'ethers';
const addresses = {
    pancakeswapFactory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    sushifactoryROPSTEN: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    WETH_DAI_PAIR: '0xd70516cD20C1448DF20F1Ed299c4c574D266A9A7',
};

const uniV2Pair = [
    'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)',
];
const uniV2Factory = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)',
    'function allPairs(uint) external view returns (address pair)',
    'function allPairsLength() external view returns (uint)',
];

const account = getAccount('http', 'BSC');

const pancakeswapFactory = new ethers.Contract(addresses.pancakeswapFactory, uniV2Factory, account);
// const sushiFactory = new ethers.Contract(addresses.sushifactoryROPSTEN, uniV2Factory, account);

// const pairAddy = await sushiFactory.getPair(
//     '0xc778417e063141139fce010982780140aa0cd5ab',
//     '0xc2118d4d90b274016cb7a54c03ef52e6c537d957'
// );
// console.log(pairAddy);
const allPairsLength = await pancakeswapFactory.allPairsLength();
let pairs = [];
console.log(allPairsLength.toNumber());
// for (let i = 0; i < allPairsLength.toNumber(); i++) {
//     const pair = await pancakeswapFactory.allPairs(i);
//     pairs.push(pair);
// }

console.log(pairs);

// const wethdai = new ethers.Contract(addresses.WETH_DAI_PAIR, uniV2Pair, account);

// wethdai.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
//     // are sender and/or to interesting?
//     console.log(`
//                 pair: ${addresses.WETH_DAI_PAIR}
//                 sender: ${sender}
//                 amount0In: ${amount0In}
//                 amount1In: ${amount1In}
//                 amount0Out: ${amount0Out}
//                 amount1Out: ${amount1Out}
//                 to: ${to}
//             `);
// });
