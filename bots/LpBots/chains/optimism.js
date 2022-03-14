import ethers from 'ethers';
import { getProvider, uniV2Factory } from '../../utils.js';

const addresses = {
    zipswapFactory: '0x8bcedd62dd46f1a76f8a1633d4f5b76e0cda521e',
};

const knownTokens = {
    WETH: {
        address: '0x4200000000000000000000000000000000000006',
        inUSD: 3200,
    },
    ZIP: {
        address: '0xfa436399d0458dbe8ab890c3441256e3e09022a8',
        inUSD: 0.105,
    },
    USDT: { address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', inUSD: 1 },
    USDC: { address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', inUSD: 1 },
    WBTC: {
        address: '0x68f180fcce6836688e9084f035309e29bf0a2095',
        inUSD: 45000,
    },
    DAI: { address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', inUSD: 1 },
};

const provider = getProvider('http', 'OPTIMISM');

const zipswap = {
    factory: new ethers.Contract(addresses.zipswapFactory, uniV2Factory, provider),
    provider,
    knownTokens,
    dexName: 'zipswap',
    chainName: 'OPTIMISM',
};

export { zipswap };
