import { ethers } from 'ethers';

const addresses = {
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
};

let provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

const factory = new ethers.Contract(
    addresses.factory,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    provider
);

const onPairCreated = async (provider, token0Address, token1Address, addressPair) => {
    console.time(`${addressPair}`);

    console.time(`getTokenMetadata(${token0Address})`);
    let token0 = await getTokenMetadata(token0Address, provider);
    console.timeEnd(`getTokenMetadata(${token0Address})`);

    console.time(`getTokenMetadata(${token1Address})`);
    let token1 = await getTokenMetadata(token1Address, provider);
    console.timeEnd(`getTokenMetadata(${token1Address})`);

    console.time(`getPairLiquidity(${addressPair})`);
    const { liq0, liq1 } = await getPairLiquidity(token0.decimals, token1.decimals, addressPair, provider);
    console.timeEnd(`getPairLiquidity(${addressPair})`);
    token0.liq = liq0;
    token1.liq = liq1;

    console.timeEnd(`${addressPair}`);

    console.log([token0, token1]);
};

const getTokenMetadata = async (tokenAddress, provider) => {
    let token = {
        address: tokenAddress,
    };

    const tokenInfoABI = [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() public view returns (uint8)',
    ];

    let success = false;
    let count = 0;

    while (!success) {
        try {
            count++;
            let contract = new ethers.Contract(token.address, tokenInfoABI, provider);
            // the 3 lines below could be optimized with Promise.all
            token.name = await contract.name();
            token.symbol = await contract.symbol();
            token.decimals = await contract.decimals();
            token.deployerAddress = contract.address;
            success = true;
        } catch (e) {
            // try 10 times
            console.log(e);
            console.log(`sleeping at ${token.address}`);
            await sleep(1000);
            if (count > 10) break;
        }
    }

    return token;
};

const getPairLiquidity = async (token0Decimals, token1Decimals, addressPair, provider) => {
    const pairContract = new ethers.Contract(
        addressPair,
        [
            'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
        ],
        provider
    );

    let success = false;
    let count = 0;
    let reserves;

    while (!success) {
        try {
            count++;
            reserves = await pairContract.getReserves();
            success = true;
        } catch (e) {
            // try 15 times
            console.log(e);
            console.log(`sleeping at ${addressPair}`);
            await sleep(1000);
            if (count > 15) break;
        }
    }

    let liq0 = 0;
    let liq1 = 0;

    try {
        liq0 = ethers.utils.formatUnits(reserves['reserve0'], token0Decimals);
        liq1 = ethers.utils.formatUnits(reserves['reserve1'], token1Decimals);
    } catch (e) {
        console.log(`could not find liquidity for tokens in the pair with address ${addressPair}`);
        console.log(e);
    }

    return { liq0, liq1 };
};

factory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    console.log(`new pair: ${addressPair}`);
    await onPairCreated(provider, token0Address, token1Address, addressPair);
});
