import ethers from 'ethers';
import { uniV2Factory, getAccount } from '../utils/utils.js';

const addresses = {
    WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    trisolarisFactory: '0xc66f594268041db60507f00703b152492fb176e7',
    wannaswapFactory: '0x7928d4fea7b2c90c732c10aff59cf403f0c38246',
};

const knownTokens = {
    NEAR: { address: '0xc42c30ac6cc15fac9bd938618bcaa1a1fae8501d', inUSD: 12 },
    USDC: { address: '0xb12bfca5a55806aaf64e99521918a4bf0fc40802', inUSD: 1 },
    USDT: { address: '0x4988a896b1227218e4a686fde5eabdcabd91571f', inUSD: 1 },
    AURORA: { address: '0x8bec47865ade3b172a928df8f990bc7f2a3b9f79', inUSD: 12 },
    TRI: {
        address: '0xfa94348467f64d5a457f75f8bc40495d33c65abb',
        inUSD: 0.85,
    },
    WETH: {
        address: '0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb',
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
