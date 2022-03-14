import connections from '../connections.js';
import 'dotenv/config';
import ethers from 'ethers';

const uniV2Factory = ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'];
const uniV3Factory = ['event PoolCreated(address token0, address token1, uint24 fee, int24 tickSpacing, address pool)'];
const uniV2Pair = [
    'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)',
];

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const getProvider = (connectionType, chain) => {
    let provider;
    if (connectionType === 'ws') {
        provider = new ethers.providers.WebSocketProvider(connections[chain][connectionType]);
    } else if (connectionType === 'http') {
        provider = new ethers.providers.JsonRpcProvider(connections[chain][connectionType]);
    }

    return provider;
};

export { sleep, getProvider, uniV2Factory, uniV3Factory, uniV2Pair };
