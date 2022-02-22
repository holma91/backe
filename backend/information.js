const information = {
    BSC: {
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1839.png',
        urls: {
            explorer: 'https://bscscan.com',
            chart: 'https://dexscreener.com/bsc/',
        },
        dexes: {
            pancakeswap: {
                url: 'https://pancakeswap.finance/swap',
            },
        },
    },
    ETH: {
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png',
        urls: {
            explorer: 'https://etherscan.io',
            chart: 'https://dexscreener.com/ethereum/',
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
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/3513.png',
        urls: {
            explorer: 'https://ftmscan.com',
            chart: 'https://dexscreener.com/fantom/',
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
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/14803.png',
        urls: {
            explorer: 'https://explorer.mainnet.aurora.dev',
            chart: 'https://dexscreener.com/aurora/',
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
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5634.png',
        urls: {
            explorer: 'https://explorer.fuse.io',
            chart: 'https://dexscreener.com/fuse/',
        },
        dexes: {
            fusefi: {
                url: 'https://app.fuse.fi/#/swap',
            },
        },
    },
    METIS: {
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/9640.png',
        urls: {
            explorer: 'https://andromeda-explorer.metis.io',
            chart: 'https://dexscreener.com/metis/',
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
        img: 'https://user-images.githubusercontent.com/14298799/122151157-0b197500-ce2d-11eb-89d8-6240e3ebe130.png',
        urls: {
            explorer: 'https://optimistic.etherscan.io',
            chart: 'https://dexscreener.com/optimism/',
        },
        dexes: {
            zipswap: {
                url: 'https://zipswap.fi/#/swap',
            },
        },
    },
    ARBITRUM: {
        img: 'https://assets.trustwalletapp.com/blockchains/arbitrum/info/logo.png',
        urls: {
            explorer: 'https://arbiscan.io',
            chart: 'https://dexscreener.com/arbitrum/',
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
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5805.png',
        urls: {
            explorer: 'https://snowtrace.io',
            chart: 'https://dexscreener.com/avalanche/',
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
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png',
        urls: {
            explorer: 'https://rinkeby.etherscan.io',
            chart: '',
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

export default information;
