const information = {
    BSC: {
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1839.png',
        explorer: {
            url: 'https://bscscan.com',
        },
        dexes: {
            pancakeswap: {
                url: 'https://pancakeswap.finance/swap',
            },
        },
    },
    ETH: {
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png',
        explorer: {
            url: 'https://etherscan.io',
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
        explorer: {
            url: 'https://ftmscan.com',
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
        explorer: {
            url: 'https://explorer.mainnet.aurora.dev',
            apikey: '',
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
        explorer: {
            url: 'https://explorer.fuse.io',
        },
        dexes: {
            fusefi: {
                url: 'https://app.fuse.fi/#/swap',
            },
        },
    },
    METIS: {
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/9640.png',
        explorer: {
            url: 'https://andromeda-explorer.metis.io',
            apikey: '',
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
        explorer: {
            url: 'https://optimistic.etherscan.io',
        },
        dexes: {
            zipswap: {
                url: 'https://zipswap.fi/#/swap',
            },
        },
    },
    ARBITRUM: {
        img: 'https://assets.trustwalletapp.com/blockchains/arbitrum/info/logo.png',
        explorer: {
            url: 'https://arbiscan.io',
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
        explorer: {
            url: 'https://snowtrace.io/',
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

export default information;
