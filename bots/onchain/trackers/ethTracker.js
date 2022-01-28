import connections from '../connections.js';
import ethers from 'ethers';
import fetch from 'node-fetch';
import { sleep } from '../utils/utils.js';
import { EtherscanProvider } from '@ethersproject/providers';

const ETH_NAME = 'Ethereum';
const ETH_SYMBOL = 'ETH';
const ETH_DECIMALS = 18;
const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

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

    async getTTEsOLD(address, currentBlock) {
        let foundTTEs = [];
        try {
            let ttes = await this.queryExplorer(address, currentBlock);
            // console.log(ttes);
            let count = 0;
            while (ttes.status === '0' && count < 60) {
                // try 60 times
                console.log(`sleeping for the ${count} time`);
                await sleep(3000);
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
        //console.log(foundTTEs);

        if (foundTTEs.length === 1) {
            // eth to erc20
            // console.log(foundTTEs[0]);
            // if from on tte is me, then it's a sell
            let swap = {};
            if (foundTTEs[0]['from'].toLowerCase() === address) {
                swap = {
                    address: address,
                    outSymbol: foundTTEs[0]['tokenSymbol'],
                    outValue: foundTTEs[0]['value'],
                    inSymbol: 'ETH',
                    inValue: '?',
                    gas: foundTTEs[0]['gasPrice'] * foundTTEs[0]['gasUsed'],
                    txHash: foundTTEs[0]['hash'],
                    blockNumber: foundTTEs[0]['blockNumber'],
                };
            } else if (foundTTEs[0]['to'].toLowerCase() === address) {
                swap = {
                    address: address,
                    outSymbol: 'ETH',
                    outValue: '?',
                    inSymbol: foundTTEs[0]['tokenSymbol'],
                    inValue: foundTTEs[0]['value'],
                    gas: foundTTEs[0]['gasPrice'] * foundTTEs[0]['gasUsed'],
                    txHash: foundTTEs[0]['hash'],
                    blockNumber: foundTTEs[0]['blockNumber'],
                };
            }
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
                    let swap = {};
                    if (subTTE[0]['from'].toLowerCase() === address) {
                        swap = {
                            address: address,
                            outSymbol: subTTE[0]['tokenSymbol'],
                            outValue: subTTE[0]['value'],
                            inSymbol: 'ETH',
                            inValue: '?',
                            gas: subTTE[0]['gasPrice'] * subTTE[0]['gasUsed'],
                            txHash: subTTE[0]['hash'],
                            blockNumber: subTTE[0]['blockNumber'],
                        };
                    } else if (subTTE[0]['to'].toLowerCase() === address) {
                        swap = {
                            address: address,
                            outSymbol: 'ETH',
                            outValue: '?',
                            inSymbol: subTTE[0]['tokenSymbol'],
                            inValue: subTTE[0]['value'],
                            gas: subTTE[0]['gasPrice'] * subTTE[0]['gasUsed'],
                            txHash: subTTE[0]['hash'],
                            blockNumber: subTTE[0]['blockNumber'],
                        };
                    }
                    swaps.push(swap);
                } else if (subTTE.length === 2) {
                    // erc20 to erc20
                    let swap = {};
                    if (subTTE[0]['from'] === address) {
                        swap = {
                            address: address,
                            outSymbol: subTTE[0]['tokenSymbol'],
                            outValue: subTTE[0]['value'],
                            inSymbol: subTTE[1]['tokenSymbol'],
                            inValue: subTTE[1]['value'],
                            gas: subTTE[0]['gasPrice'] * subTTE[0]['gasUsed'],
                            txHash: subTTE[0]['hash'],
                            blockNumber: subTTE[0]['blockNumber'],
                        };
                    } else if (subTTE[1]['from'] === address) {
                        swap = {
                            address: address,
                            outSymbol: subTTE[1]['tokenSymbol'],
                            outValue: subTTE[1]['value'],
                            inSymbol: subTTE[0]['tokenSymbol'],
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

    async getTTEs(activeAddresses, blockNumber) {
        let foundTTEs = [];
        try {
            for (let address of activeAddresses) {
                let ttes = await this.queryExplorer(address, blockNumber);
                let count = 0;
                while (ttes.status === '0' && count < 60) {
                    console.log(`sleeping for the ${count} time with ${address} at block ${blockNumber}`);
                    await sleep(3000);
                    ttes = await this.queryExplorer(address, blockNumber);
                    count++;
                }

                if (ttes.status === '1') {
                    for (const tte of ttes.result) {
                        // unnecessary check on chains with multiple second finality
                        if (parseInt(tte.blockNumber) === blockNumber) {
                            foundTTEs.push(tte);
                        }
                    }
                }
            }
        } catch (e) {
            console.log(`error while trying to get erc20 ttes from ${address} at block ${blockNumber}`);
            console.log(e);
        }

        return foundTTEs;
    }

    async getSwaps(activeAddresses, blockNumber) {
        let foundTTEs = await this.getTTEs(activeAddresses, blockNumber);
        // console.log('foundTTEs:', foundTTEs);
        let swaps = [];

        if (foundTTEs.length === 1) {
            // eth <-> erc20
            let swap = {};
            if (activeAddresses.includes(foundTTEs[0]['from'].toLowerCase())) {
                // the addreess sold a token for eth
                swap = {
                    address: foundTTEs[0]['from'].toLowerCase(),

                    outName: foundTTEs[0]['tokenName'],
                    outSymbol: foundTTEs[0]['tokenSymbol'],
                    outValue: foundTTEs[0]['value'],
                    outAddress: foundTTEs[0]['contractAddress'],
                    outDecimals: foundTTEs[0]['tokenDecimal'],
                    inName: ETH_NAME,
                    inSymbol: ETH_SYMBOL,
                    inValue: '?',
                    inAddress: ETH_ADDRESS,
                    inDecimals: ETH_DECIMALS,
                    gas: foundTTEs[0]['gasPrice'] * foundTTEs[0]['gasUsed'],
                    txHash: foundTTEs[0]['hash'],
                    blockNumber: foundTTEs[0]['blockNumber'],
                    timestamp: foundTTEs[0]['timeStamp'],
                };
            } else if (activeAddresses.includes(foundTTEs[0]['to'].toLowerCase())) {
                // the address bought a token with eth
                swap = {
                    address: foundTTEs[0]['to'].toLowerCase(),
                    outName: ETH_NAME,
                    outSymbol: ETH_SYMBOL,
                    outValue: '?',
                    outAddress: ETH_ADDRESS,
                    outDecimals: ETH_DECIMALS,
                    inName: foundTTEs[0]['tokenName'],
                    inSymbol: foundTTEs[0]['tokenSymbol'],
                    inValue: foundTTEs[0]['value'],
                    inAddress: foundTTEs[0]['contractAddress'],
                    inDecimals: foundTTEs[0]['tokenDecimal'],
                    gas: foundTTEs[0]['gasPrice'] * foundTTEs[0]['gasUsed'],
                    txHash: foundTTEs[0]['hash'],
                    blockNumber: foundTTEs[0]['blockNumber'],
                    timestamp: foundTTEs[0]['timeStamp'],
                };
            }
            swaps.push(swap);
        } else if (foundTTEs.length > 1) {
            // probably erc20 <-> erc20
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
                    // eth <-> erc20
                    let swap = {};
                    if (activeAddresses.includes(subTTE[0]['from'].toLowerCase())) {
                        swap = {
                            address: subTTE[0]['from'].toLowerCase(),
                            outName: subTTE[0]['tokenName'],
                            outSymbol: subTTE[0]['tokenSymbol'],
                            outValue: subTTE[0]['value'],
                            outAddress: subTTE[0]['contractAddress'],
                            outDecimals: subTTE[0]['tokenDecimal'],
                            inName: ETH_NAME,
                            inSymbol: ETH_SYMBOL,
                            inValue: '?',
                            inAddress: ETH_ADDRESS,
                            inDecimals: ETH_DECIMALS,
                            gas: subTTE[0]['gasPrice'] * subTTE[0]['gasUsed'],
                            txHash: subTTE[0]['hash'],
                            blockNumber: subTTE[0]['blockNumber'],
                            timestamp: subTTE[0]['timeStamp'],
                        };
                    } else if (activeAddresses.includes(subTTE[0]['to'].toLowerCase())) {
                        swap = {
                            address: subTTE[0]['to'].toLowerCase(),
                            outName: ETH_NAME,
                            outSymbol: ETH_SYMBOL,
                            outValue: '?',
                            outAddress: ETH_ADDRESS,
                            outDecimals: ETH_DECIMALS,
                            inName: subTTE[0]['tokenName'],
                            inSymbol: subTTE[0]['tokenSymbol'],
                            inValue: subTTE[0]['value'],
                            inAddress: subTTE[0]['contractAddress'],
                            inDecimals: subTTE[0]['tokenDecimal'],
                            gas: subTTE[0]['gasPrice'] * subTTE[0]['gasUsed'],
                            txHash: subTTE[0]['hash'],
                            blockNumber: subTTE[0]['blockNumber'],
                            timestamp: subTTE[0]['timeStamp'],
                        };
                    }
                    swaps.push(swap);
                } else if (subTTE.length === 2) {
                    // erc20 <-> erc20
                    let swap = {};
                    if (activeAddresses.includes(subTTE[0]['from'].toLowerCase())) {
                        swap = {
                            address: subTTE[0]['from'].toLowerCase(),

                            outName: subTTE[0]['tokenName'],
                            outSymbol: subTTE[0]['tokenSymbol'],
                            outValue: subTTE[0]['value'],
                            outAddress: subTTE[0]['contractAddress'],
                            outDecimals: subTTE[0]['tokenDecimal'],

                            inName: subTTE[1]['tokenName'],
                            inSymbol: subTTE[1]['tokenSymbol'],
                            inValue: subTTE[1]['value'],
                            inAddress: subTTE[1]['contractAddress'],
                            inDecimals: subTTE[1]['tokenDecimal'],

                            gas: subTTE[0]['gasPrice'] * subTTE[0]['gasUsed'],
                            txHash: subTTE[0]['hash'],
                            blockNumber: subTTE[0]['blockNumber'],
                            timestamp: subTTE[0]['timeStamp'],
                        };
                    } else if (activeAddresses.includes(subTTE[1]['from'].toLowerCase())) {
                        swap = {
                            address: subTTE[1]['from'].toLowerCase(),

                            outName: subTTE[1]['tokenName'],
                            outSymbol: subTTE[1]['tokenSymbol'],
                            outValue: subTTE[1]['value'],
                            outAddress: subTTE[1]['contractAddress'],
                            outDecimals: subTTE[1]['tokenDecimal'],

                            inName: subTTE[0]['tokenName'],
                            inSymbol: subTTE[0]['tokenSymbol'],
                            inValue: subTTE[0]['value'],
                            inAddress: subTTE[0]['contractAddress'],
                            inDecimals: subTTE[0]['tokenDecimal'],

                            gas: subTTE[1]['gasPrice'] * subTTE[1]['gasUsed'],
                            txHash: subTTE[1]['hash'],
                            blockNumber: subTTE[1]['blockNumber'],
                            timestamp: subTTE[1]['timeStamp'],
                        };
                    }

                    swaps.push(swap);
                }
            }
        }

        return swaps;
    }

    async checkBlock() {
        try {
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
                        }
                    }
                }

                if (activeAddresses.length > 0) {
                    // activeAddresses now consists of the addresses we care about that did something
                    let swaps = await this.getSwaps(activeAddresses, blockNumber);

                    // swaps is now all swaps in this block that we care about
                    // console.log(swaps);

                    for (let swap of swaps) {
                        let inRes = await fetch(
                            `https://api.coingecko.com/api/v3/coins/ethereum/contract/${swap['inAddress']}`
                        );
                        while (inRes.status_code === 429) {
                            await sleep(5000);
                            console.log(
                                `rate limited by cg, sleeping at ${swap['inName']} with address ${swap['inAddress']}`
                            );
                            inRes = await fetch(
                                `https://api.coingecko.com/api/v3/coins/ethereum/contract/${swap['inAddress']}`
                            );
                        }
                        let inToken = await inRes.json();
                        if (!inToken['error']) {
                            swap['inOnCoingecko'] = 'true';
                            swap['inMarketCapRank'] = inToken['market_cap_rank'];
                            swap['inMarketCap'] = inToken['market_data']['market_cap']['usd'];
                            swap['inTotalVolume'] = inToken['market_data']['total_volume']['usd'];
                            swap['inPrice'] = inToken['market_data']['current_price']['usd'];
                            swap['inPriceChange24H'] = inToken['market_data']['price_change_percentage_24h'] + '%';
                            swap['inPriceChange7D'] = inToken['market_data']['price_change_percentage_7d'] + '%';
                        } else {
                            swap['inOnCoingecko'] = 'false';
                        }

                        let outRes = await fetch(
                            `https://api.coingecko.com/api/v3/coins/ethereum/contract/${swap['outAddress']}`
                        );
                        while (outRes.status_code === 429) {
                            await sleep(5000);
                            console.log(
                                `rate limited by cg, sleeping at ${swap['outName']} with address ${swap['outAddress']}`
                            );
                            outRes = await fetch(
                                `https://api.coingecko.com/api/v3/coins/ethereum/contract/${swap['outAddress']}`
                            );
                        }
                        let outToken = await outRes.json();
                        if (!outToken['error']) {
                            swap['outOnCoingecko'] = 'true';
                            swap['outMarketCapRank'] = outToken['market_cap_rank'];
                            swap['outMarketCap'] = outToken['market_data']['market_cap']['usd'];
                            swap['outTotalVolume'] = outToken['market_data']['total_volume']['usd'];
                            swap['outPrice'] = outToken['market_data']['current_price']['usd'];
                            swap['outPriceChange24H'] = outToken['market_data']['price_change_percentage_24h'] + '%';
                            swap['outPriceChange24H'] = outToken['market_data']['price_change_percentage_7d'] + '%';
                        } else {
                            swap['outOnCoingecko'] = 'false';
                        }
                    }

                    console.log(swaps);
                }
            }
        } catch (e) {
            console.log(e);
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
    '0x4d638adb8c07a78655e9ae88641c4202774e6584',
    '0x9762b1d716bb97735905996e013d61c140722249',
    '0x80d4230c0a68fc59cb264329d3a717fcaa472a13',
    '0x2a8f327085d733a3dba191b3647818415a84ff28',
    '0x0001005071007b00cf908145cbde238724005200',
]);

setInterval(() => {
    txChecker.checkBlock();
}, 2000);

// tests with 1 address
// eth -> erc : 1
// eth -> erc : 2
// erc -> eth : 1
// erc -> eth : 2
// erc -> erc : 2
// mixed
