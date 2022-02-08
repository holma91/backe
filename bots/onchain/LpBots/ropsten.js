import ethers from 'ethers';
import { MNEMONIC, ROPSTEN_WEBSOCKET } from '../env.js';
import { getPairLiquidity, onPairCreated, uniV2Factory, uniV3Factory } from '../utils/utils.js';

const addresses = {
    sushiswapFactory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
};

const established_tokenAddresses = {
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
};

const provider = new ethers.providers.WebSocketProvider(ROPSTEN_WEBSOCKET);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(provider);

const sushiswapFactory = new ethers.Contract(addresses.sushiswapFactory, uniV2Factory, account);

console.log('ethereum ropsten DEX sync started\nsupported dexes: UniSwap, SushiSwap');

sushiswapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    // console.log(`token0Address = ${token0Address}`);
    // console.log(`token1Address = ${token1Address}`);
    // console.log(`addressPair = ${addressPair}`);
    const { token0Decimals, token1Decimals } = await onPairCreated(
        account,
        token0Address,
        token1Address,
        addressPair,
        'ETH',
        'sushiswap',
        established_tokenAddresses
    );
    console.log(`token0Decimals = ${token0Decimals}\ntoken1Decimals = ${token1Decimals}`);

    // get liquidity in intervals
    const intervals = [10000, 60000, 600000]; // 10s, 1m, 10m
    for (const interval of intervals) {
        console.log('interval: ', interval);
        function x() {
            var promise = new Promise(function (resolve, reject) {
                window.setTimeout(function () {
                    resolve('done!');
                });
            });
            return promise;
        }
    }
});

const getLiq = () => {};
