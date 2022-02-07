import { ethers } from 'ethers';
import { getAccount, onPairCreated } from './utils/utils.js';

const addresses = {
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
};

const account = getAccount('http', 'BSC');

const factory = new ethers.Contract(
    addresses.factory,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    account
);

factory.on('PairCreated', async (token0, token1, addressPair) => {
    console.log(`new pair: ${addressPair}`);
    await onPairCreated(account, token0Address, token1Address, addressPair, 'BSC', 'pancakeswap', knownTokens);
});
