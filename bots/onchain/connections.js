const connections = {
    BSC: {
        http: 'https://proud-spring-surf.bsc.quiknode.pro/b8e15d7a6b1a823a907f79e8722f7320ee5b9dbd/',
        ws: 'wss://proud-spring-surf.bsc.quiknode.pro/b8e15d7a6b1a823a907f79e8722f7320ee5b9dbd/',
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1839.png',
        explorer: {
            url: 'https://bscscan.com',
            apikey: '9W1BVC324ZY6RMEDES1R5RJ5WTGV8YTQJE',
        },
        webhooks: {
            newPair:
                'https://discord.com/api/webhooks/934827281036242954/UZA8javKyZJxuEfoSPH7m8V6J8-tcgQFvjAJaNmBjrlgTHhF70CrRP0gozkRqOsxtO8w',
        },
        dexes: {
            pancakeswap: {
                url: 'https://pancakeswap.finance/swap',
            },
        },
    },
    ETH: {
        http: 'https://eth-mainnet.alchemyapi.io/v2/5EL1sxQhPfThf-ISs-UDJe9FqPtVrRWu/',
        ws: 'wss://eth-mainnet.alchemyapi.io/v2/5EL1sxQhPfThf-ISs-UDJe9FqPtVrRWu/',
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png',
        explorer: {
            url: 'https://etherscan.io',
            apikey: '',
        },
        webhooks: {
            newPair:
                'https://discord.com/api/webhooks/934827062508781629/4fB-HJk50erWQePNw-XEleTgVXfveJg4liaYBnI2w9puj9bwaNQXojLIrIqbfRfEYuiD',
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
        ws: 'ws://rpc.fantom.network:18546/',
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/3513.png',
        explorer: {
            url: 'https://ftmscan.com',
            apikey: '',
        },
        webhooks: {
            newPair:
                'https://discord.com/api/webhooks/934826724238176266/dHBPDhUH5aSmwgOARV_EGCUVc9XG3E-GLmih02yOOu5BUcduf_lqV2h5WurZ2xN8Jokr',
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
        http: 'https://mainnet.aurora.dev/',
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/14803.png',
        explorer: {
            url: 'https://explorer.mainnet.aurora.dev',
            apikey: '',
        },
        webhooks: {
            newPair:
                'https://discord.com/api/webhooks/934826079246491668/NV0LJj0KM6NBXs3gDfPSbmvSatlx6sH4vS4fqGkQv02AmxoOldl127JaA2Mn8JPtn6y6',
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
        http: 'https://rpc.fuse.io/',
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5634.png',
        explorer: {
            url: 'https://explorer.fuse.io',
            apikey: '',
        },
        webhooks: {
            newPair:
                'https://discord.com/api/webhooks/934825031047999528/jKUvABIMgr2k5fcsO91w8yClupv-eSM0-koG5MlQOQMFxM6REoIQS72k9mKBDG1ps99u',
        },
        dexes: {
            fusefi: {
                url: 'https://app.fuse.fi/#/swap',
            },
        },
    },
    METIS: {
        http: 'https://andromeda.metis.io/',
        ws: 'wss://andromeda-ws.metis.io/',
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/9640.png',
        explorer: {
            url: 'https://andromeda-explorer.metis.io',
            apikey: '',
        },
        webhooks: {
            newPair:
                'https://discord.com/api/webhooks/934824542747123732/Jtp1IaSsdadErpCHii21VTaBTFpFNSfBidiRqTr47-S0TsOGinAXKze9N5SEMZ5AoN4L',
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
        http: 'https://mainnet.optimism.io/',
        ws: 'wss://ws-mainnet.optimism.io/',
        img: 'https://user-images.githubusercontent.com/14298799/122151157-0b197500-ce2d-11eb-89d8-6240e3ebe130.png',
        explorer: {
            url: 'https://optimistic.etherscan.io',
            apikey: '',
        },
        webhooks: {
            newPair:
                'https://discord.com/api/webhooks/934822746158948372/n8zgRUF0R6QkUi-SzyqLDtrVdJ8a9pPFeXFzwJ8kaZsFLR6V5aCv0FNmrXZTuGDXHrl1',
        },
        dexes: {
            zipswap: {
                url: 'https://zipswap.fi/#/swap',
            },
        },
    },
    AVAX: {
        http: 'https://api.avax.network/ext/bc/C/rpc/',
        ws: 'https://api.avax.network/ext/bc/C/ws/',
        img: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5805.png',
        explorer: {
            url: 'https://snowtrace.io/',
            apikey: '',
        },
        webhooks: {
            newPair:
                'https://discord.com/api/webhooks/934826441022013470/BHVsJIckpqOr_Sgel1fCB3Um8afST1_XW5-vIamnjZnzFxt46wio0-Kwr_pHU3_Np--a',
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
        ws: 'wss://eth-ropsten.alchemyapi.io/v2/VMq6K7b9MLmchJCB5hkgRdiYKEoY2Qqx/',
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
