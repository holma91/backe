import ethers from 'ethers';
import fetch from 'node-fetch';
import Big from 'big.js';
import 'dotenv/config';
import { uniV2Pair } from '../utils/utils.js';

const URL = process.env.environment === 'PROD' ? process.env.prodURL : process.env.devURL;

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
            default:
                break;
        }
    } catch (e) {
        console.log(`problem with ${chain}`);
        console.log(e);
    }
    return price;
};

const existsOnCoingecko = async (chain, address) => {
    let network;

    switch (chain) {
        case 'ETH':
            network = 'ethereum';
            break;
        case 'BSC':
            network = 'binance-smart-chain';
            break;
        default:
            break;
    }

    try {
        let response = await fetch(
            `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${address}&vs_currencies=usd`
        );
        let data = await response.json();

        return data[address] !== undefined;
    } catch (e) {
        console.log(e);
    }
};

const isSenderInteresting = async (sender) => {
    const response = await fetch(`http://localhost:3005/accounts/${sender}/`);
    return response.status !== 404;
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
            onCoingecko: false,
        },
        token1: {
            name: pair.token1Name,
            symbol: pair.token1Symbol,
            address: pair.token1Address,
            order: '',
            amount: 0,
            priceUSD: 0,
            onCoingecko: false,
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
        swap.token0.onCoingecko = true;
        swap.token1.onCoingecko = await existsOnCoingecko(swap.chain, swap.token1.address);
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
        swap.token1.onCoingecko = true;
        swap.token0.onCoingecko = await existsOnCoingecko(swap.chain, swap.token0.address);
    }

    swap.token0.amount = new Big(swap.token0.amount).toPrecision(6);
    swap.token1.amount = new Big(swap.token1.amount).toPrecision(6);

    // console.log(swap);

    let response = await fetch(`${URL}/accounts/${swap.senderAddress}?include_labels=yes`);
    let account = await response.json();
    swap.senderLabel = account.labelId;

    fetch(`${URL}/trades`, {
        method: 'post',
        body: JSON.stringify(swap),
        headers: { 'Content-Type': 'application/json' },
    });
};

const cachedBoringAddresses = new Set();

const setUpPair = (pair, account, nativeTokenAddress, stablecoins) => {
    console.log('setting up', pair);
    const pairContract = new ethers.Contract(pair.pairAddress, uniV2Pair, account);

    pairContract.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
        sender = sender.toLowerCase();
        if (cachedBoringAddresses.has(sender)) return;

        if (!(await isSenderInteresting(sender))) {
            console.log(`${sender} is not of interest`);
            cachedBoringAddresses.add(sender);
            return;
        }

        await onNewSwap(pair, sender, amount0In, amount1In, amount0Out, amount1Out, nativeTokenAddress, stablecoins);
    });
};

export default setUpPair;
