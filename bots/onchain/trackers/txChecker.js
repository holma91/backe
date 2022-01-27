import connections from '../connections.js';
import ethers from 'ethers';
import fetch from 'node-fetch';
import { sleep } from '../utils/utils.js';

class TransactionChecker {
    provider;
    addresses;
    latestBlock;
    apikey;

    constructor(connection, addresses) {
        this.provider = new ethers.providers.JsonRpcProvider(connection);
        this.addresses = addresses.map((address) => address.toLowerCase());
        this.latestBlock = 0;
        this.apikey = 'FJVSJ3Q8PD233E51ZPCPI6EGZRVZKFCD5C';
    }

    async queryExplorer(address, currentBlock) {
        // let reqString = `https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=${currentBlock}&endblock=999999999&sort=asc&apikey=${this.apikey}`;
        let reqString = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=${currentBlock}&endblock=999999999&sort=asc&apikey=${this.apikey}`;
        // console.log(reqString);
        const response = await fetch(reqString);
        const ttes = await response.json();
        return ttes;
    }

    async getTTEs(address, currentBlock) {
        let foundTTEs = [];
        try {
            sleep(5000);
            let ttes = await this.queryExplorer(address, currentBlock);
            console.log(ttes);
            let count = 0;
            while (ttes.status === '0' && count < 60) {
                // try 60 times
                console.log(`sleeping for the ${count} time`);
                sleep(5000);
                ttes = await this.queryExplorer(address, currentBlock);
                count++;
            }
            if (ttes.status === '1') {
                // we have found something!
                for (const tte of ttes.result) {
                    // unnecessary check on chains with multiple second finality
                    if (parseInt(tte.blockNumber) === currentBlock) {
                        foundTTEs.push(tte);
                    }
                }
            }
        } catch (e) {
            console.log(`error while trying to get erc20 ttes from ${address} at block ${currentBlock}`);
            console.log(e);
        }

        let swaps = [];
        console.log(foundTTEs);

        if (foundTTEs.length === 1) {
            // eth to erc20
            let swap = {
                address: address,
                outToken: 'ETH',
                outValue: '?',
                inToken: foundTTEs[0]['tokenSymbol'],
                inValue: foundTTEs[0]['value'],
                gas: foundTTEs[0]['gasPrice'] * foundTTEs[0]['gasUsed'],
                txHash: foundTTEs[0]['hash'],
                blockNumber: foundTTEs[0]['blockNumber'],
            };
            swaps.push(swap);
        } else if (foundTTEs.length > 1) {
            // probably erc20 to erc20
            let subTTEs = {};
            for (const tte of foundTTEs) {
                if (!subTTEs[tte['hash']]) {
                    subTTEs[tte['hash']] = [tte];
                } else {
                    subTTEs[tte['hash']].push(tte);
                }
            }

            for (let subTTE of Object.values(subTTEs)) {
                if (subTTE.length > 2) throw `three ttes with the same tx hash! ${subTTE[0]['hash']}`;
                if (subTTE.length === 1) {
                    let swap = {
                        address: address,
                        outToken: 'ETH',
                        outValue: '?',
                        inToken: subTTE['tokenSymbol'],
                        inValue: subTTE['value'],
                        gas: subTTE['gasPrice'] * subTTE['gasUsed'],
                        txHash: subTTE['hash'],
                        blockNumber: subTTE['blockNumber'],
                    };
                    swaps.push(swap);
                } else if (subTTE.length === 2) {
                    // erc20 to erc20
                    let swap = {};
                    if (subTTE[0]['from'] === address) {
                        swap = {
                            address: address,
                            outToken: subTTE[0]['tokenSymbol'],
                            outValue: subTTE[0]['value'],
                            inToken: subTTE[1]['tokenSymbol'],
                            inValue: subTTE[1]['value'],
                            gas: subTTE[0]['gasPrice'] * subTTE[0]['gasUsed'],
                            txHash: subTTE[0]['hash'],
                            blockNumber: subTTE[0]['blockNumber'],
                        };
                    } else if (subTTE[1]['from'] === address) {
                        swap = {
                            address: address,
                            outToken: subTTE[1]['tokenSymbol'],
                            outValue: subTTE[1]['value'],
                            inToken: subTTE[0]['tokenSymbol'],
                            inValue: subTTE[0]['value'],
                            gas: subTTE[1]['gasPrice'] * subTTE[1]['gasUsed'],
                            txHash: subTTE[1]['hash'],
                            blockNumber: subTTE[1]['blockNumber'],
                        };
                    }

                    swaps.push(swap);
                }
            }
        }

        return swaps;
    }

    async checkBlock() {
        let blockNumber = await this.provider.getBlockNumber();
        if (blockNumber <= this.latestBlock) return;
        this.latestBlock = blockNumber;

        console.log('Checking block ' + blockNumber);
        let block = await this.provider.getBlockWithTransactions(blockNumber);

        if (block != null && block.transactions != null) {
            let activeAddresses = [];
            for (let tx of block.transactions) {
                tx.from = tx.from.toLowerCase();
                if (this.addresses.includes(tx.from)) {
                    if (!activeAddresses.includes(tx.from)) {
                        activeAddresses.push(tx.from);
                        let swaps = await this.getTTEs(tx.from, blockNumber);
                        console.log('swaps:', swaps);
                        continue;
                    }
                }
            }
        }
    }
}

// let txChecker = new TransactionChecker(connections.ETH.http, '0xe1Dd30fecAb8a63105F2C035B084BfC6Ca5B1493');
// let txChecker = new TransactionChecker('https://eth-ropsten.alchemyapi.io/v2/VMq6K7b9MLmchJCB5hkgRdiYKEoY2Qqx', [
//     '0xdcb9048D6bb9C31e60af7595ef597ADC642B9cB6',
// ]);
let txChecker = new TransactionChecker(connections.ETH.http, [
    '0xdcb9048D6bb9C31e60af7595ef597ADC642B9cB6',
    '0x11d625109d9257c24d8a3ab8128c4a95a2cf5c31',
    '0x0f4ee9631f4be0a63756515141281a3e2b293bbe',
    '0x4deb3edd991cfd2fcdaa6dcfe5f1743f6e7d16a6',
    '0xe0a9efe32985cc306255b395a1bd06d21ccead42',
    '0xff2fbc735d33ae830f056107f1b551783ec4ed5b',
    '0xc53fc02d1412bda659647dd0f8807404e3eeb850',
    '0xc18406aa413b4d08c729e7312239c34e45c61197',
]);
setInterval(() => {
    txChecker.checkBlock();
}, 5000);
