import ethers from 'ethers';
import fetch from 'node-fetch';
import connections from '../connections.js';
import { sleep } from '../utils/utils.js';

const ETH_NAME = 'Ethereum';
const ETH_SYMBOL = 'ETH';
const ETH_DECIMALS = 18;
const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

const ETH = {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
};

class TransactionChecker {
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
            reqString = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=${currentBlock}&endblock=999999999&sort=asc&apikey=${this.apikey}`;
        } else if (this.chain === 'BSC') {
            reqString = `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&startblock=${currentBlock}&endblock=999999999&sort=asc&apikey=${this.apikey}`;
        } else if (this.chain === 'ROPSTEN') {
            reqString = `https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=${currentBlock}&endblock=999999999&sort=asc&apikey=${this.apikey}`;
        }
        // console.log(reqString);
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
        for (const swap of swaps) {
            let inRes = await fetch(
                `https://api.coingecko.com/api/v3/coins/${networkName}/contract/${swap.in.contractAddress}`
            );
            while (inRes.status_code === 429) {
                await sleep(5000);
                console.log(
                    `rate limited by cg, sleeping at ${swap.in.name} with address ${swap.in.contractAddress}`
                );
                inRes = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${networkName}/contract/${swap.in.contractAddress}`
                );
            }
            const inToken = await inRes.json();
            if (!inToken.error) {
                swap.in.onCoingecko = 'true';
                swap.in.marketCapRank = inToken.market_cap_rank;
                swap.in.marketCap = inToken.market_data.market_cap.usd;
                swap.in.totalVolume = inToken.market_data.total_volume.usd;
                swap.in.price = inToken.market_data.current_price.usd;
                swap.in.priceChange24H = inToken.market_data.price_change_percentage_24h;
                swap.in.priceChange7D = inToken.market_data.price_change_percentage_7d;
                // swap['in']['valueUSD'] = (
                //     ethers.BigNumber.from(swap['in']['price']) * ethers.BigNumber.from(swap['in']['value'])
                // ).toString();
            } else {
                swap.in.onCoingecko = 'false';
            }

            let outRes = await fetch(
                `https://api.coingecko.com/api/v3/coins/${networkName}/contract/${swap.out.contractAddress}`
            );
            while (outRes.status_code === 429) {
                await sleep(5000);
                console.log(
                    `rate limited by cg, sleeping at ${swap.out.name} with address ${swap.out.contractAddress}`
                );
                outRes = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${networkName}/contract/${swap.out.contractAddress}`
                );
            }
            const outToken = await outRes.json();
            if (!outToken.error) {
                swap.out.onCoingecko = 'true';
                swap.out.marketCapRank = outToken.market_cap_rank;
                swap.out.marketCap = outToken.market_data.market_cap.usd;
                swap.out.totalVolume = outToken.market_data.total_volume.usd;
                swap.out.price = outToken.market_data.current_price.usd;
                swap.out.priceChange24H = outToken.market_data.price_change_percentage_24h;
                swap.out.priceChange7D = outToken.market_data.price_change_percentage_7d;
                // swap['out']['valueUSD'] = (
                //     ethers.BigNumber.from(swap['out']['price']) * ethers.BigNumber.from(swap['out']['value'])
                // ).toString();
            } else {
                swap.out.onCoingecko = 'false';
            }
        }

        return swaps;
    }

    async getTTEs(activeAddresses, blockNumber) {
        const foundTTEs = [];
        try {
            for (const address of activeAddresses) {
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
        const foundTTEs = await this.getTTEs(activeAddresses, blockNumber);
        const swaps = [];

        if (foundTTEs.length === 1) {
            // native <-> erc20
            let swap = {};
            if (activeAddresses.includes(foundTTEs[0].from.toLowerCase())) {
                // the address sold a token for the native token
                swap = {
                    address: foundTTEs[0].from.toLowerCase(),
                    out: {
                        name: foundTTEs[0].tokenName,
                        symbol: foundTTEs[0].tokenSymbol,
                        value: ethers.utils.formatUnits(foundTTEs[0].value, foundTTEs[0].tokenDecimal),
                        contractAddress: foundTTEs[0].contractAddress,
                    },
                    in: {
                        name: this.nativeToken.name,
                        symbol: this.nativeToken.symbol,
                        value: '?',
                        contractAddress: this.nativeToken.address,
                    },
                    txHash: foundTTEs[0].hash,
                    blockNumber: foundTTEs[0].blockNumber,
                    timestamp: foundTTEs[0].timeStamp,
                };
            } else if (activeAddresses.includes(foundTTEs[0].to.toLowerCase())) {
                // the address bought a token with eth
                swap = {
                    address: foundTTEs[0].to.toLowerCase(),
                    out: {
                        name: this.nativeToken.name,
                        symbol: this.nativeToken.symbol,
                        value: '?',
                        contractAddress: this.nativeToken.address,
                    },
                    in: {
                        name: foundTTEs[0].tokenName,
                        symbol: foundTTEs[0].tokenSymbol,
                        value: ethers.utils.formatUnits(foundTTEs[0].value, foundTTEs[0].tokenDecimal),
                        contractAddress: foundTTEs[0].contractAddress,
                    },
                    txHash: foundTTEs[0].hash,
                    blockNumber: foundTTEs[0].blockNumber,
                    timestamp: foundTTEs[0].timeStamp,
                };
            }
            swaps.push(swap);
        } else if (foundTTEs.length > 1) {
            // probably erc20 <-> erc20
            const subTTEs = {};
            for (const tte of foundTTEs) {
                if (!subTTEs[tte.hash]) {
                    subTTEs[tte.hash] = [tte];
                } else {
                    subTTEs[tte.hash].push(tte);
                }
            }

            for (const subTTE of Object.values(subTTEs)) {
                if (subTTE.length > 2) throw `three ttes with the same tx hash! ${subTTE[0].hash}`;
                if (subTTE.length === 1) {
                    // eth <-> erc20
                    let swap = {};
                    if (activeAddresses.includes(subTTE[0].from.toLowerCase())) {
                        swap = {
                            address: subTTE[0].from.toLowerCase(),
                            out: {
                                name: subTTE[0].tokenName,
                                symbol: subTTE[0].tokenSymbol,
                                value: ethers.utils.formatUnits(subTTE[0].value, subTTE[0].tokenDecimal),
                                contractAddress: subTTE[0].contractAddress,
                            },
                            in: {
                                name: this.nativeToken.name,
                                symbol: this.nativeToken.symbol,
                                value: '?',
                                contractAddress: this.nativeToken.address,
                            },
                            txHash: subTTE[0].hash,
                            blockNumber: subTTE[0].blockNumber,
                            timestamp: subTTE[0].timeStamp,
                        };
                    } else if (activeAddresses.includes(subTTE[0].to.toLowerCase())) {
                        swap = {
                            address: subTTE[0].to.toLowerCase(),
                            out: {
                                name: this.nativeToken.name,
                                symbol: this.nativeToken.symbol,
                                value: '?',
                                contractAddress: this.nativeToken.address,
                            },
                            in: {
                                name: subTTE[0].tokenName,
                                symbol: subTTE[0].tokenSymbol,
                                value: ethers.utils.formatUnits(subTTE[0].value, subTTE[0].tokenDecimal),
                                contractAddress: subTTE[0].contractAddress,
                            },
                            txHash: subTTE[0].hash,
                            blockNumber: subTTE[0].blockNumber,
                            timestamp: subTTE[0].timeStamp,
                        };
                    }
                    swaps.push(swap);
                } else if (subTTE.length === 2) {
                    // erc20 <-> erc20
                    let swap = {};
                    if (activeAddresses.includes(subTTE[0].from.toLowerCase())) {
                        swap = {
                            address: subTTE[0].from.toLowerCase(),
                            out: {
                                name: subTTE[0].tokenName,
                                symbol: subTTE[0].tokenSymbol,
                                value: ethers.utils.formatUnits(subTTE[0].value, subTTE[0].tokenDecimal),
                                contractAddress: subTTE[0].contractAddress,
                            },
                            in: {
                                name: subTTE[1].tokenName,
                                symbol: subTTE[1].tokenSymbol,
                                value: ethers.utils.formatUnits(subTTE[1].value, subTTE[1].tokenDecimal),
                                contractAddress: subTTE[1].contractAddress,
                            },
                            txHash: subTTE[0].hash,
                            blockNumber: subTTE[0].blockNumber,
                            timestamp: subTTE[0].timeStamp,
                        };
                    } else if (activeAddresses.includes(subTTE[1].from.toLowerCase())) {
                        swap = {
                            address: subTTE[1].from.toLowerCase(),
                            out: {
                                name: subTTE[1].tokenName,
                                symbol: subTTE[1].tokenSymbol,
                                value: ethers.utils.formatUnits(subTTE[1].value, subTTE[1].tokenDecimal),
                                contractAddress: subTTE[1].contractAddress,
                            },
                            in: {
                                name: subTTE[0].tokenName,
                                symbol: subTTE[0].tokenSymbol,
                                value: ethers.utils.formatUnits(subTTE[0].value, subTTE[0].tokenDecimal),
                                contractAddress: subTTE[0].contractAddress,
                            },
                            txHash: subTTE[1].hash,
                            blockNumber: subTTE[1].blockNumber,
                            timestamp: subTTE[1].timeStamp,
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
        const blockNumber = await this.provider.getBlockNumber();
        if (this.latestBlock === 0) return [blockNumber];
        if (blockNumber <= this.latestBlock) return [];

        const missed = blockNumber - this.latestBlock;
        const missedBlockNumbers = [];
        for (let i = 1; i <= missed; i++) {
            missedBlockNumbers.push(this.latestBlock + i);
        }
        return missedBlockNumbers;
    }

    async checkBlock() {
        try {
            const blockNumbers = await this.getBlockNumbers();
            if (blockNumbers.length === 0) return;

            this.latestBlock = blockNumbers[blockNumbers.length - 1];

            for (const blockNumber of blockNumbers) {
                // run every iteration of this loop in parallell somehow
                console.log(`Checking block ${blockNumber} on ${this.chain}`);
                const block = await this.provider.getBlockWithTransactions(blockNumber);

                if (block != null && block.transactions != null) {
                    const activeAddresses = [];
                    for (const tx of block.transactions) {
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
const addys = [
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
    '0xb7da1d05e8046c422f8344b74ebab556cc324a94',
    '0x89627989c7483dade7f86949931a55f48b02827f',
    '0x42d4c197036bd9984ca652303e07dd29fa6bdb37',
    '0x2cab89d7b88eafeb4ecf2d64a5e198ee664d3c2d',
    '0xe61ca8d4e835cf7e1989beb76426fe01a1238e10',
    '0x442ddad80cc2870f276800a177351e0bc69aceb5',
    '0xe45c35eb5daa1980fc5bb80fb5298b0ade934ba6',
    '0x0e5a65c3660020f75c29c4665c5392bf6cb889f1',
    '0xd02c260f54997146c9028b2ac7144b11ce4c20a6',
    '0xc252a841af842a55b0f0b507f68f3864bf1c02b5',
    '0xceebc5c76c1c4329dee0d962b365cfa16e178a39',
    '0x0e5a65c3660020f75c29c4665c5392bf6cb889f1',
    '0xe45c35eb5daa1980fc5bb80fb5298b0ade934ba6',
    '0x442ddad80cc2870f276800a177351e0bc69aceb5',
    '0x18ee55cc36387db47c1a9808b979ceea5401c300',
];
// let txChecker = new TransactionChecker(
//     'https://eth-ropsten.alchemyapi.io/v2/VMq6K7b9MLmchJCB5hkgRdiYKEoY2Qqx',
//     ['0xdcb9048D6bb9C31e60af7595ef597ADC642B9cB6'],
//     connections.ETH.explorer.apikey,
//     'ROPSTEN',
//     ETH
// );
const txChecker = new TransactionChecker(connections.ETH.http, addys, connections.ETH.explorer.apikey, 'ETH', ETH);

setInterval(() => {
    txChecker.checkBlock();
}, 5000);

// tests with 1 address
// eth -> erc : 1
// eth -> erc : 2
// erc -> eth : 1
// erc -> eth : 2
// erc -> erc : 2
// mixed
