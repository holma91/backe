import ethers from 'ethers';
import { getAccount, uniV2Factory } from '../utils/utils.js';

const addresses = {
    netswapFactory: '0x70f51d68D16e8f9e418441280342BD43AC9Dff9f',
    tethysFactory: '0x2CdFB20205701FF01689461610C9F321D1d00F80',
};

const knownTokens = {
    METIS: { address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000', inUSD: 170 },
    WETH: { address: '0x420000000000000000000000000000000000000A', inUSD: 2500 },
    mUSDC: { address: '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21', inUSD: 1.0 },
    mUSDT: { address: '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC', inUSD: 1.0 },
};

const account = getAccount('http', 'METIS');

const netswap = {
    factory: new ethers.Contract(addresses.netswapFactory, uniV2Factory, account),
    account: account,
    knownTokens: knownTokens,
    dexName: 'netswap',
    chainName: 'METIS',
};

const tethys = {
    factory: new ethers.Contract(addresses.tethysFactory, uniV2Factory, account),
    account: account,
    knownTokens: knownTokens,
    dexName: 'tethys',
    chainName: 'METIS',
};

export { netswap, tethys };
