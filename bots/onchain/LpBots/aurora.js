import ethers from 'ethers';
import { uniV2Factory, getAccount } from '../utils/utils.js';

const addresses = {
    WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    trisolarisFactory: '0xc66F594268041dB60507F00703b152492fb176E7',
    wannaswapFactory: '0x7928D4FeA7b2c90C732c10aFF59cf403f0C38246',
};

const knownTokens = {
    NEAR: {
        address: '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d',
        inUSD: 12,
    },
    USDC: {
        address: '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802',
        inUSD: 1.0,
    },
    USDT: {
        address: '0x4988a896b1227218e4A686fdE5EabdcAbd91571f',
        inUSD: 1.0,
    },
    AURORA: {
        address: '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79',
        inUSD: 12,
    },
    TRI: {
        address: '0xFa94348467f64D5A457F75F8bc40495D33c65aBB',
        inUSD: 0.85,
    },
    WETH: {
        address: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
        inUSD: 3200,
    },
};

const account = getAccount('http', 'AURORA');

const trisolaris = {
    factory: new ethers.Contract(addresses.trisolarisFactory, uniV2Factory, account),
    account: account,
    knownTokens: knownTokens,
    dexName: 'trisolaris',
    chainName: 'AURORA',
};

const wannaswap = {
    factory: new ethers.Contract(addresses.wannaswapFactory, uniV2Factory, account),
    account: account,
    knownTokens: knownTokens,
    dexName: 'wannaswap',
    chainName: 'AURORA',
};

export { trisolaris, wannaswap };
