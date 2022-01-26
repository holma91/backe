import connections from '../connections.js';
import ethers from 'ethers';
import fetch from 'node-fetch';

class TransactionChecker {
    provider;
    address;
    latestBlock;

    constructor(connection, address) {
        this.provider = new ethers.providers.JsonRpcProvider(connection);
        this.address = address.toLowerCase();
        this.latestBlock = 0;
    }

    async checkBlock() {
        let blockNumber = await this.provider.getBlockNumber();
        if (blockNumber <= this.latestBlock) return;
        this.latestBlock = blockNumber;

        console.log('Checking block ' + blockNumber);
        let block = await this.provider.getBlockWithTransactions(blockNumber);

        if (block != null && block.transactions != null) {
            for (let tx of block.transactions) {
                if (tx.from.toLowerCase() === this.address) {
                    // the address is doing something
                    const response = await fetch(
                        'https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=0x4e83362442b8d1bec281594cea3050c8eb01311c&startblock=0&endblock=999999999&sort=asc&apikey=YourApiKeyToken'
                    );
                    console.log(tx);
                }
            }
        }
    }
}

// let txChecker = new TransactionChecker(connections.ETH.http, '0xe1Dd30fecAb8a63105F2C035B084BfC6Ca5B1493');
let txChecker = new TransactionChecker(
    'https://eth-ropsten.alchemyapi.io/v2/VMq6K7b9MLmchJCB5hkgRdiYKEoY2Qqx',
    '0xdcb9048D6bb9C31e60af7595ef597ADC642B9cB6'
);
setInterval(() => {
    txChecker.checkBlock();
}, 5000);
