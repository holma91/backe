import ethers from 'ethers';
import { getAccount, uniV2Factory } from '../createdPair.js';

const addresses = {
    netswapFactory: '0x70f51d68d16e8f9e418441280342bd43ac9dff9f',
    tethysFactory: '0x2cdfb20205701ff01689461610c9f321d1d00f80',
};

const knownTokens = {
    METIS: { address: '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000', inUSD: 150 },
    WETH: {
        address: '0x420000000000000000000000000000000000000a',
        inUSD: 3200,
    },
    mUSDC: { address: '0xea32a96608495e54156ae48931a7c20f0dcc1a21', inUSD: 1 },
    mUSDT: { address: '0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc', inUSD: 1 },
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
