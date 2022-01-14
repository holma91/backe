import ethers from 'ethers';
import { MNEMONIC, AURORA_HTTP } from '../env.js';
import { uniV2Factory } from '../utils/utils.js';

const addresses = {
    WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    trisolarisFactory: '0xc66F594268041dB60507F00703b152492fb176E7',
    wannaswapFactory: '0x7928D4FeA7b2c90C732c10aFF59cf403f0C38246',
};

const established_tokenAddresses = {
    WNEAR: '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d',
    USDC: '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802',
    USDT: '0x4988a896b1227218e4A686fdE5EabdcAbd91571f',
    AURORA: '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79',
    TRI: '0xFa94348467f64D5A457F75F8bc40495D33c65aBB',
};

const provider = new ethers.providers.JsonRpcProvider(AURORA_HTTP);
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(provider);

const trisolarisFactory = new ethers.Contract(addresses.trisolarisFactory, uniV2Factory, account);

const wannaswapFactory = new ethers.Contract(addresses.wannaswapFactory, uniV2Factory, account);

console.log('aurora DEX sync started\nsupported dexes: trisolaris, wannaswap');

let receivedPairs = 0;
let displayedPairs = 0;
trisolarisFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    receivedPairs++;
    console.log(`NEW PAIR ${addressPair}, receivedPairs = ${receivedPairs}`);
    await onPairCreated(
        account,
        token0Address,
        token1Address,
        addressPair,
        'AURORA',
        'trisolaris',
        established_tokenAddresses
    );
    displayedPairs++;
    console.log(`DISPLAYED PAIR ${addressPair}, displayedPairs = ${displayedPairs}`);
});

wannaswapFactory.on('PairCreated', async (token0Address, token1Address, addressPair) => {
    receivedPairs++;
    console.log(`NEW PAIR ${addressPair}, receivedPairs = ${receivedPairs}`);
    await onPairCreated(
        account,
        token0Address,
        token1Address,
        addressPair,
        'AURORA',
        'wannaswap',
        established_tokenAddresses
    );
    displayedPairs++;
    console.log(`DISPLAYED PAIR ${addressPair}, displayedPairs = ${displayedPairs}`);
});
