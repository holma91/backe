import ethers from 'ethers';
import { getAccount, uniV2Pair } from '../utils/utils.js';
import connections from '../connections.js';

const addresses = {
    me: '0x4391CD3D728252e3cBF55C8c30fBc679B6725526',
    dev: '0xdcb9048D6bb9C31e60af7595ef597ADC642B9cB6',
    LOOKS: '0xf4d2888d29D722226FafA5d9B24F9164c092421E',
    ROP_DAI: '0xad6d458402f60fd3bd25163575031acdce07538d',
    ROP_UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
};

let provider = new ethers.providers.JsonRpcProvider(connections.ROPSTEN.http);
const abi = ['event Transfer(address indexed src, address indexed dst, uint val)'];

let contract = new ethers.Contract(addresses.ROP_DAI, abi, provider);

let filter = {
    address: addresses.ROP_DAI,
    topics: [ethers.utils.id('Transfer(address,address,uint256)')],
};
provider.on(filter, (log, event) => {
    // Emitted whenever a DAI token transfer occurs
    console.log('log:', log);
    console.log('event:', event);
});
