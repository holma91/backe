import ethers from 'ethers';
import { MNEMONIC, ETH_WEBSOCKET } from '../env.js';
import { onPairCreated, uniV2Factory, uniV3Factory } from '../utils/utils.js';

const addresses = {
    uniswapFactory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    sushiswapFactory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
};

const established_tokenAddresses = {
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
};

const provider = new ethers.providers.WebSocketProvider(ETH_WEBSOCKET);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(provider);

const uniswapFactory = new ethers.Contract(addresses.uniswapFactory, uniV3Factory, account);
const sushiswapFactory = new ethers.Contract(addresses.sushiswapFactory, uniV2Factory, account);

console.log('ethereum DEX sync started\nsupported dexes: UniSwap, SushiSwap');

uniswapFactory.on('PoolCreated', async (token0Address, token1Address, fee, tickSpacing, pool) => {
    await onPairCreated(account, token0Address, token1Address, pool, 'ETH', 'uniswap', established_tokenAddresses);
});

sushiswapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    await onPairCreated(
        account,
        token0Address,
        token1Address,
        addressPair,
        'ETH',
        'sushiswap',
        established_tokenAddresses
    );
});
