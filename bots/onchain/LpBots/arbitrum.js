import ethers from 'ethers';
import { getAccount, uniV2Factory, uniV3Factory } from '../utils/utils.js';

const addresses = {
    uniswapFactory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
    sushiswapFactory: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
};

const knownTokens = {
    WETH: {
        address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        inUSD: 3200,
    },
    USDC: {
        address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        inUSD: 1.0,
    },
    USDT: {
        address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        inUSD: 1.0,
    },
    DAI: {
        address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        inUSD: 1.0,
    },
};

const account = getAccount('http', 'ARBITRUM');

const uniswapARBITRUM = {
    factory: new ethers.Contract(addresses.uniswapFactory, uniV3Factory, account),
    account: account,
    knownTokens: knownTokens,
    dexName: 'uniswapARBITRUM',
    chainName: 'ETH',
};

const sushiswapARBITRUM = {
    factory: new ethers.Contract(addresses.sushiswapFactory, uniV2Factory, account),
    account: account,
    knownTokens: knownTokens,
    dexName: 'sushiswapARBITRUM',
    chainName: 'ETH',
};

export { uniswapARBITRUM, sushiswapARBITRUM };
