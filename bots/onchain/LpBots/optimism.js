import ethers from 'ethers';
import { getAccount, uniV2Factory } from '../utils/utils.js';

const addresses = {
    zipswapFactory: '0x8BCeDD62DD46F1A76F8A1633d4f5B76e0CDa521E',
};

const knownTokens = {
    WETH: { address: '0x4200000000000000000000000000000000000006', inUSD: 3200 },
    ZIP: { address: '0xFA436399d0458Dbe8aB890c3441256E3E09022a8', inUSD: 0.105 },
    USDT: { address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', inUSD: 1.0 },
    USDC: { address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', inUSD: 1.0 },
    WBTC: { address: '0x68f180fcce6836688e9084f035309e29bf0a2095', inUSD: 45000 },
    DAI: { address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', inUSD: 1.0 },
};

const account = getAccount('http', 'OPTIMISM');

const zipswap = {
    factory: new ethers.Contract(addresses.zipswapFactory, uniV2Factory, account),
    account: account,
    knownTokens: knownTokens,
    dexName: 'zipswap',
    chainName: 'OPTIMISM',
};

export { zipswap };
