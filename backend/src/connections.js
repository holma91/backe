import { createRequire } from 'module'; // Bring in the ability to create the 'require' method in es6 modules
const require = createRequire(import.meta.url); // construct the require method
const path = require('path');
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connections = {
    BSC: {
        http: process.env.bsc_http,
        ws: process.env.bsc_ws,
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1839.png',
        explorer: {
            url: 'https://bscscan.com',
            apikey: process.env.bscscan_apikey,
        },
        webhooks: {
            newPair: process.env.bsc_newpairhook,
            newTrade: process.env.bsc_newtradehook,
        },
        dexes: {
            pancakeswap: {
                url: 'https://pancakeswap.finance/swap',
            },
        },
    },
    ETH: {
        http: process.env.eth_http,
        ws: process.env.eth_ws,
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png',
        explorer: {
            url: 'https://etherscan.io',
            apikey: process.env.etherscan_apikey,
        },
        webhooks: {
            newPair: process.env.eth_newpairhook,
            newTrade: process.env.eth_newtradehook,
        },
        dexes: {
            uniswap: {
                url: 'https://app.uniswap.org/#/swap',
            },
            sushiswap: {
                url: 'https://app.sushi.com/en/swap',
            },
        },
    },
    FTM: {
        http: process.env.ftm_http,
        ws: process.env.ftm_ws,
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/3513.png',
        explorer: {
            url: 'https://ftmscan.com',
            apikey: process.env.ftmscan_apikey,
        },
        webhooks: {
            newPair: process.env.ftm_newpairhook,
            newTrade: process.env.ftm_newtradehook,
        },
        dexes: {
            spookyswap: {
                url: 'https://spookyswap.finance/swap',
            },
            spiritswap: {
                url: 'https://swap.spiritswap.finance/#/exchange/swap',
            },
        },
    },

    AURORA: {
        http: process.env.aurora_http,
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/14803.png',
        explorer: {
            url: 'https://explorer.mainnet.aurora.dev',
            apikey: '',
        },
        webhooks: {
            newPair: process.env.aurora_newpairhook,
            newTrade: process.env.aurora_newtradehook,
        },
        dexes: {
            trisolaris: {
                url: 'https://www.trisolaris.io/#/swap',
            },
            wannaswap: {
                url: 'https://wannaswap.finance/exchange/swap',
            },
        },
    },
    FUSE: {
        http: process.env.fuse_http,
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5634.png',
        explorer: {
            url: 'https://explorer.fuse.io',
            apikey: '',
        },
        webhooks: {
            newPair: process.env.fuse_newpairhook,
            newTrade: process.env.fuse_newtradehook,
        },
        dexes: {
            fusefi: {
                url: 'https://app.fuse.fi/#/swap',
            },
        },
    },
    METIS: {
        http: process.env.metis_http,
        ws: process.env.metis_ws,
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/9640.png',
        explorer: {
            url: 'https://andromeda-explorer.metis.io',
            apikey: '',
        },
        webhooks: {
            newPair: process.env.metis_newpairhook,
            newTrade: process.env.metis_newtradehook,
        },
        dexes: {
            netswap: {
                url: 'https://netswap.io/#/swap',
            },
            tethys: {
                url: 'https://tethys.finance/swap',
            },
        },
    },
    OPTIMISM: {
        http: process.env.optimism_http,
        ws: process.env.optimism_ws,
        img: 'https://user-images.githubusercontent.com/14298799/122151157-0b197500-ce2d-11eb-89d8-6240e3ebe130.png',
        explorer: {
            url: 'https://optimistic.etherscan.io',
            apikey: '',
        },
        webhooks: {
            newPair: process.env.optimism_newpairhook,
            newTrade: process.env.optimism_newtradehook,
        },
        dexes: {
            zipswap: {
                url: 'https://zipswap.fi/#/swap',
            },
        },
    },
    ARBITRUM: {
        http: process.env.arbitrum_http,
        img: 'https://assets.trustwalletapp.com/blockchains/arbitrum/info/logo.png',
        explorer: {
            url: 'https://arbiscan.io',
            apikey: '',
        },
        webhooks: {
            newPair: process.env.arbitrum_newpairhook,
            newTrade: process.env.arbitrum_newtradehook,
        },
        dexes: {
            uniswap: {
                url: 'https://app.uniswap.org/#/swap?chain=arbitrum',
            },
            sushiswap: {
                url: 'https://app.sushi.com/en/swap',
            },
        },
    },
    AVAX: {
        http: process.env.avax_http,
        ws: process.env.avax_ws,
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5805.png',
        explorer: {
            url: 'https://snowtrace.io/',
            apikey: '',
        },
        webhooks: {
            newPair: process.env.avax_newpairhook,
            newTrade: process.env.avax_newtradehook,
        },
        dexes: {
            traderjoe: {
                url: 'https://traderjoexyz.com/#/trade',
            },
            pangolin: {
                url: 'https://app.pangolin.exchange/#/swap',
            },
        },
    },
    ROPSTEN: {
        http: process.env.ropsten_http,
        ws: process.env.ropsten_ws,
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png',
        explorer: {
            url: 'https://rinkeby.etherscan.io',
            apikey: '',
        },
        webhooks: {
            newPair: '',
        },
        dexes: {
            uniswap: {
                url: 'https://app.uniswap.org/#/swap',
            },
            sushiswap: {
                url: 'https://app.sushi.com/en/swap',
            },
        },
    },
};

export default connections;
