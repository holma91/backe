import ethers from 'ethers';
import connections from '../../connections.js';

const factoryABI = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)',
    'function allPairs(uint) external view returns (address pair)',
    'function allPairsLength() external view returns (uint)',
];

const getAccount = (connectionType, chain) => {
    let provider;
    if (connectionType === 'ws') {
        provider = new ethers.providers.WebSocketProvider(connections[chain][connectionType]);
    } else if (connectionType === 'http') {
        provider = new ethers.providers.JsonRpcProvider(connections[chain][connectionType]);
    }
    const wallet = ethers.Wallet.fromMnemonic(process.env.mnemonic);
    return wallet.connect(provider);
};

export { getAccount, factoryABI };
