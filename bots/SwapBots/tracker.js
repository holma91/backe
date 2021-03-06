import ethers from 'ethers';
import fetch from 'node-fetch';
import Big from 'big.js';
import 'dotenv/config';
import { uniV2Pair } from '../utils.js';

const getPrice = async (chain, nativeTokenAddress) => {
    let response;
    let data;
    let price = 0;
    try {
        switch (chain) {
            case 'ETH':
                response = await fetch(
                    `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${nativeTokenAddress}&vs_currencies=usd`
                );
                data = await response.json();
                price = data[nativeTokenAddress]['usd'];
                break;
            case 'BSC':
                response = await fetch(
                    `https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=${nativeTokenAddress}&vs_currencies=usd`
                );
                data = await response.json();
                price = data[nativeTokenAddress]['usd'];
                break;
            case 'FTM':
                response = await fetch(
                    `https://api.coingecko.com/api/v3/simple/token_price/fantom?contract_addresses=${nativeTokenAddress}&vs_currencies=usd`
                );
                data = await response.json();
                price = data[nativeTokenAddress]['usd'];
                break;
            default:
                break;
        }
    } catch (e) {
        console.log(`problem with ${chain}`);
        console.log(e);
    }
    return price;
};

/**
 * getCoingecko stats checks if the swapped token exists on cg
 * if yes, returns the market cap rank as well
 */
const getCoingeckoStats = async (chain, address) => {
    // mapping to the network ids at coingecko
    let coinToNetwork = {
        ETH: 'ethereum',
        BSC: 'binance-smart-chain',
        FTM: 'fantom',
        AVAX: 'avalanche',
        AURORA: 'aurora',
        OPTIMISM: 'optimistic-ethereum',
        ARBITRUM: 'arbitrum-one',
        FUSE: 'fuse',
        METIS: 'metis-andromeda',
    };

    try {
        let response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinToNetwork[chain]}/contract/${address}`
            // `https://api.coingecko.com/api/v3/simple/token_price/${coinToNetwork[chain]}?contract_addresses=${address}&vs_currencies=usd`
        );
        let data = await response.json();

        if (data.error) return { exists: false };

        let marketCapRank = data['market_cap_rank'];
        // let marketCap = data['market_data']['market_cap']['usd'];

        return { exists: true, marketCapRank };
    } catch (e) {
        console.log(e);
    }
};

const onNewSwap = async (
    pair,
    sender,
    amount0In,
    amount1In,
    amount0Out,
    amount1Out,
    nativeTokenAddress,
    stablecoins
) => {
    console.log('new interesting swap!');
    const stablecoinAddresses = Object.keys(stablecoins);
    amount0In = ethers.utils.formatUnits(amount0In, pair.token0Decimals);
    amount0Out = ethers.utils.formatUnits(amount0Out, pair.token0Decimals);
    amount1In = ethers.utils.formatUnits(amount1In, pair.token1Decimals);
    amount1Out = ethers.utils.formatUnits(amount1Out, pair.token1Decimals);

    let swap = {
        chain: pair.chain,
        dex: pair.dex,
        pairAddress: pair.pairAddress,
        senderAddress: sender,
        senderLabel: '',
        token0: {
            name: pair.token0Name,
            symbol: pair.token0Symbol,
            address: pair.token0Address,
            order: '',
            amount: 0,
            priceUSD: 0,
            coingecko: { exists: false },
        },
        token1: {
            name: pair.token1Name,
            symbol: pair.token1Symbol,
            address: pair.token1Address,
            order: '',
            amount: 0,
            priceUSD: 0,
            coingecko: { exists: false },
        },
    };

    // everything is from the pool's perspective, so selling and buying need to be reversed for the user
    if (pair.token0Address === nativeTokenAddress || stablecoinAddresses.includes(pair.token0Address)) {
        swap.token0.priceUSD =
            pair.token0Address === nativeTokenAddress
                ? new Big(await getPrice(swap.chain, nativeTokenAddress))
                : new Big(1);

        if (amount0In !== '0.0') {
            // token0in, token1out
            swap.token0.order = 'sell';
            swap.token0.amount = amount0In;
            swap.token1.order = 'buy';
            swap.token1.amount = amount1Out;
            swap.token1.priceUSD = swap.token0.priceUSD
                .times(swap.token0.amount)
                .div(swap.token1.amount)
                .toPrecision(6);
        } else if (amount0Out !== '0.0') {
            // token0out, token1in
            swap.token0.order = 'buy';
            swap.token0.amount = amount0Out;
            swap.token1.order = 'sell';
            swap.token1.amount = amount1In;
            swap.token1.priceUSD = swap.token0.priceUSD
                .times(swap.token0.amount)
                .div(swap.token1.amount)
                .toPrecision(6);
        }

        swap.token0.priceUSD = swap.token0.priceUSD.toPrecision(6);
        swap.token0.coingecko.exists = true;
        swap.token1.coingecko = await getCoingeckoStats(swap.chain, swap.token1.address);
    } else if (pair.token1Address === nativeTokenAddress || stablecoinAddresses.includes(pair.token1Address)) {
        swap.token1.priceUSD =
            pair.token1Address === nativeTokenAddress
                ? new Big(await getPrice(swap.chain, nativeTokenAddress))
                : new Big(1);

        if (amount1In !== '0.0') {
            // token1in, token0out
            swap.token0.order = 'buy';
            swap.token0.amount = amount0Out;
            swap.token1.order = 'sell';
            swap.token1.amount = amount1In;
            swap.token0.priceUSD = swap.token1.priceUSD
                .times(swap.token1.amount)
                .div(swap.token0.amount)
                .toPrecision(6);
        } else if (amount1Out !== '0.0') {
            // token1out, token0in
            swap.token0.order = 'sell';
            swap.token0.amount = amount0In;
            swap.token1.order = 'buy';
            swap.token1.amount = amount1Out;
            swap.token0.priceUSD = swap.token1.priceUSD
                .times(swap.token1.amount)
                .div(swap.token0.amount)
                .toPrecision(6);
        }
        swap.token1.priceUSD = swap.token1.priceUSD.toPrecision(6);
        swap.token1.coingecko.exists = true;
        swap.token0.coingecko = await getCoingeckoStats(swap.chain, swap.token0.address);
    }

    swap.token0.amount = new Big(swap.token0.amount).toPrecision(6);
    swap.token1.amount = new Big(swap.token1.amount).toPrecision(6);

    console.log(swap);
    const URL = process.env.api_url;

    try {
        let response = await fetch(`${URL}/accounts/${swap.senderAddress}?include_labels=yes`);
        let account = await response.json();
        swap.senderLabel = account.labelId;
    } catch (e) {
        console.log(e);
    }

    fetch(`${URL}/trades`, {
        method: 'post',
        body: JSON.stringify(swap),
        headers: { 'Content-Type': 'application/json' },
    });
};

const setUpPair = (pair, provider, nativeTokenAddress, stablecoins, interestingAddresses) => {
    const pairContract = new ethers.Contract(pair.pairAddress, uniV2Pair, provider);
    console.log('setting up', pair);

    // listen for emitted Swap events
    pairContract.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
        sender = sender.toLowerCase();
        if (!interestingAddresses.has(sender)) {
            // we do not care about these swaps
            return;
        }

        await onNewSwap(pair, sender, amount0In, amount1In, amount0Out, amount1Out, nativeTokenAddress, stablecoins);
    });
};

export default setUpPair;
