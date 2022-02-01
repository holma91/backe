import ethers from 'ethers';
import fetch from 'node-fetch';
import { sleep } from '../utils/utils.js';

class evmTransactionTracker {
    provider;
    addresses;
    latestBlock;
    apikey;
    chain;
    nativeToken;

    constructor(connection, addresses, apikey, chain, nativeToken) {
        this.provider = new ethers.providers.JsonRpcProvider(connection);
        this.addresses = addresses.map((address) => address.toLowerCase());
        this.latestBlock = 0;
        this.apikey = apikey;
        this.chain = chain;
        this.nativeToken = nativeToken;
    }

    async queryExplorer(address, currentBlock) {
        let reqString = '';
        if (this.chain === 'ETH') {
            reqString = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=${currentBlock}&endblock=${currentBlock}&sort=asc&apikey=${this.apikey}`;
        } else if (this.chain === 'BSC') {
            reqString = `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&startblock=${currentBlock}&endblock=${currentBlock}&sort=asc&apikey=${this.apikey}`;
        } else if (this.chain === 'FTM') {
            reqString = `https://api.ftmscan.com/api?module=account&action=tokentx&address=${address}&startblock=${currentBlock}&endblock=${currentBlock}&sort=asc&apikey=${this.apikey}`;
        } else if (this.chain === 'ROPSTEN') {
            reqString = `https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=${currentBlock}&endblock=${currentBlock}&sort=asc&apikey=${this.apikey}`;
        }

        const response = await fetch(reqString);
        const ttes = await response.json();
        return ttes;
    }

    async insertPriceData(swaps) {
        // add price data to every swap object
        let networkName = '';
        switch (this.chain) {
            case 'ETH':
                networkName = 'ethereum';
                break;
            case 'BSC':
                networkName = 'binance-smart-chain';
                break;
        }
        for (let swap of swaps) {
            let inRes = await fetch(
                `https://api.coingecko.com/api/v3/coins/${networkName}/contract/${swap['in']['contractAddress']}`
            );
            while (inRes.status_code === 429) {
                await sleep(5000);
                console.log(
                    `rate limited by cg, sleeping at ${swap['in']['name']} with address ${swap['in']['contractAddress']}`
                );
                inRes = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${networkName}/contract/${swap['in']['contractAddress']}`
                );
            }
            let inToken = await inRes.json();
            if (!inToken['error']) {
                swap['in']['onCoingecko'] = 'true';
                swap['in']['marketCapRank'] = inToken['market_cap_rank'];
                swap['in']['marketCap'] = inToken['market_data']['market_cap']['usd'];
                swap['in']['totalVolume'] = inToken['market_data']['total_volume']['usd'];
                swap['in']['price'] = inToken['market_data']['current_price']['usd'];
                swap['in']['priceChange24H'] = inToken['market_data']['price_change_percentage_24h'];
                swap['in']['priceChange7D'] = inToken['market_data']['price_change_percentage_7d'];
                // swap['in']['valueUSD'] = (
                //     ethers.BigNumber.from(swap['in']['price']) * ethers.BigNumber.from(swap['in']['value'])
                // ).toString();
            } else {
                swap['in']['onCoingecko'] = 'false';
            }

            let outRes = await fetch(
                `https://api.coingecko.com/api/v3/coins/${networkName}/contract/${swap['out']['contractAddress']}`
            );
            while (outRes.status_code === 429) {
                await sleep(5000);
                console.log(
                    `rate limited by cg, sleeping at ${swap['out']['name']} with address ${swap['out']['contractAddress']}`
                );
                outRes = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${networkName}/contract/${swap['out']['contractAddress']}`
                );
            }
            let outToken = await outRes.json();
            if (!outToken['error']) {
                swap['out']['onCoingecko'] = 'true';
                swap['out']['marketCapRank'] = outToken['market_cap_rank'];
                swap['out']['marketCap'] = outToken['market_data']['market_cap']['usd'];
                swap['out']['totalVolume'] = outToken['market_data']['total_volume']['usd'];
                swap['out']['price'] = outToken['market_data']['current_price']['usd'];
                swap['out']['priceChange24H'] = outToken['market_data']['price_change_percentage_24h'];
                swap['out']['priceChange7D'] = outToken['market_data']['price_change_percentage_7d'];
                // swap['out']['valueUSD'] = (
                //     ethers.BigNumber.from(swap['out']['price']) * ethers.BigNumber.from(swap['out']['value'])
                // ).toString();
            } else {
                swap['out']['onCoingecko'] = 'false';
            }
        }

        return swaps;
    }

    async getTTEs(activeAddresses, blockNumber) {
        let foundTTEs = [];
        try {
            for (let address of activeAddresses) {
                await sleep(15000);
                let ttes = await this.queryExplorer(address, blockNumber);
                let count = 0;
                while (ttes.status === '0' && count < 10) {
                    count++;
                    // implement exponential backoff here with different params depending on chain
                    console.log(`sleeping for the ${count} time with ${address} at block ${blockNumber}`);
                    await sleep(3000 * count);
                    ttes = await this.queryExplorer(address, blockNumber);
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
        let swaps = [];

        if (foundTTEs.length === 1) {
            // native <-> erc20
            let swap = {};
            if (activeAddresses.includes(foundTTEs[0]['from'].toLowerCase())) {
                // the address sold a token for the native token
                swap = {
                    address: foundTTEs[0]['from'].toLowerCase(),
                    out: {
                        name: foundTTEs[0]['tokenName'],
                        symbol: foundTTEs[0]['tokenSymbol'],
                        value: ethers.utils.formatUnits(foundTTEs[0]['value'], foundTTEs[0]['tokenDecimal']),
                        contractAddress: foundTTEs[0]['contractAddress'],
                    },
                    in: {
                        name: this.nativeToken.name,
                        symbol: this.nativeToken.symbol,
                        value: '?',
                        contractAddress: this.nativeToken.address,
                    },
                    txHash: foundTTEs[0]['hash'],
                    blockNumber: foundTTEs[0]['blockNumber'],
                    timestamp: foundTTEs[0]['timeStamp'],
                };
            } else if (activeAddresses.includes(foundTTEs[0]['to'].toLowerCase())) {
                // the address bought a token with eth
                swap = {
                    address: foundTTEs[0]['to'].toLowerCase(),
                    out: {
                        name: this.nativeToken.name,
                        symbol: this.nativeToken.symbol,
                        value: '?',
                        contractAddress: this.nativeToken.address,
                    },
                    in: {
                        name: foundTTEs[0]['tokenName'],
                        symbol: foundTTEs[0]['tokenSymbol'],
                        value: ethers.utils.formatUnits(foundTTEs[0]['value'], foundTTEs[0]['tokenDecimal']),
                        contractAddress: foundTTEs[0]['contractAddress'],
                    },
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
                            out: {
                                name: subTTE[0]['tokenName'],
                                symbol: subTTE[0]['tokenSymbol'],
                                value: ethers.utils.formatUnits(subTTE[0]['value'], subTTE[0]['tokenDecimal']),
                                contractAddress: subTTE[0]['contractAddress'],
                            },
                            in: {
                                name: this.nativeToken.name,
                                symbol: this.nativeToken.symbol,
                                value: '?',
                                contractAddress: this.nativeToken.address,
                            },
                            txHash: subTTE[0]['hash'],
                            blockNumber: subTTE[0]['blockNumber'],
                            timestamp: subTTE[0]['timeStamp'],
                        };
                    } else if (activeAddresses.includes(subTTE[0]['to'].toLowerCase())) {
                        swap = {
                            address: subTTE[0]['to'].toLowerCase(),
                            out: {
                                name: this.nativeToken.name,
                                symbol: this.nativeToken.symbol,
                                value: '?',
                                contractAddress: this.nativeToken.address,
                            },
                            in: {
                                name: subTTE[0]['tokenName'],
                                symbol: subTTE[0]['tokenSymbol'],
                                value: ethers.utils.formatUnits(subTTE[0]['value'], subTTE[0]['tokenDecimal']),
                                contractAddress: subTTE[0]['contractAddress'],
                            },
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
                            out: {
                                name: subTTE[0]['tokenName'],
                                symbol: subTTE[0]['tokenSymbol'],
                                value: ethers.utils.formatUnits(subTTE[0]['value'], subTTE[0]['tokenDecimal']),
                                contractAddress: subTTE[0]['contractAddress'],
                            },
                            in: {
                                name: subTTE[1]['tokenName'],
                                symbol: subTTE[1]['tokenSymbol'],
                                value: ethers.utils.formatUnits(subTTE[1]['value'], subTTE[1]['tokenDecimal']),
                                contractAddress: subTTE[1]['contractAddress'],
                            },
                            txHash: subTTE[0]['hash'],
                            blockNumber: subTTE[0]['blockNumber'],
                            timestamp: subTTE[0]['timeStamp'],
                        };
                    } else if (activeAddresses.includes(subTTE[1]['from'].toLowerCase())) {
                        swap = {
                            address: subTTE[1]['from'].toLowerCase(),
                            out: {
                                name: subTTE[1]['tokenName'],
                                symbol: subTTE[1]['tokenSymbol'],
                                value: ethers.utils.formatUnits(subTTE[1]['value'], subTTE[1]['tokenDecimal']),
                                contractAddress: subTTE[1]['contractAddress'],
                            },
                            in: {
                                name: subTTE[0]['tokenName'],
                                symbol: subTTE[0]['tokenSymbol'],
                                value: ethers.utils.formatUnits(subTTE[0]['value'], subTTE[0]['tokenDecimal']),
                                contractAddress: subTTE[0]['contractAddress'],
                            },
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

    async getBlockNumbers() {
        // logic to make sure a block is never missed
        let blockNumber = await this.provider.getBlockNumber();
        if (this.latestBlock === 0) return [blockNumber];
        if (blockNumber <= this.latestBlock) return [];

        let missed = blockNumber - this.latestBlock;
        let missedBlockNumbers = [];
        for (let i = 1; i <= missed; i++) {
            missedBlockNumbers.push(this.latestBlock + i);
        }
        return missedBlockNumbers;
    }

    async checkBlock() {
        try {
            let blockNumbers = await this.getBlockNumbers();
            if (blockNumbers.length === 0) return;

            this.latestBlock = blockNumbers[blockNumbers.length - 1];

            for (let blockNumber of blockNumbers) {
                // run every iteration of this loop in parallell somehow
                console.log(`Checking block ${blockNumber} on ${this.chain}`);
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
                        swaps = await this.insertPriceData(swaps);

                        console.log(swaps);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}

export default evmTransactionTracker;
