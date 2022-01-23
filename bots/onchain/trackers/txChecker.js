import ethers from 'ethers';
import { MNEMONIC, ETH_HTTP } from '../env.js';

class TransactionChecker {
    web3;
    account;


    constructor(projectId, account) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/' + projectId));
        this.provider = new ethers.providers.JsonRpcProvider(ETH_HTTP);
        
        this.account = account.toLowerCase();

    }

    async checkBlock() {
        let block = await this.web3.eth.getBlock('latest');
        let number = block.number;
        console.log('Searching block ' + number);

        if (block != null && block.transactions != null) {
            for (let txHash of block.transactions) {
                let tx = await this.web3.eth.getTransaction(txHash);
                if (this.account == tx.to.toLowerCase()) {
                    console.log('Transaction found on block: ' + number);
                    console.log({
                        address: tx.from,
                        value: this.web3.utils.fromWei(tx.value, 'ether'),
                        timestamp: new Date(),
                    });
                }
            }
        }
    }
}

let txChecker = new TransactionChecker(process.env.INFURA_ID, '0xe1Dd30fecAb8a63105F2C035B084BfC6Ca5B1493');
setInterval(() => {
    txChecker.checkBlock();
}, 15 * 1000);
