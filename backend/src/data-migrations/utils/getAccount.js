const ethers = require('ethers');
const connections = require('../../connections');

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

module.exports = getAccount;
