const schemas = {
    pair: {
        type: 'object',
        properties: {
            chain: { type: 'string' },
            dex: { type: 'string' },
            address: { type: 'string' },
            token0: {
                type: { type: 'object' },
                properties: {
                    address: { type: 'string' },
                    name: { type: 'string' },
                    symbol: { type: 'string' },
                    decimals: { type: 'number' },
                },
                minProperties: 4,
            },
            token1: {
                type: { type: 'object' },
                properties: {
                    address: { type: 'string' },
                    name: { type: 'string' },
                    symbol: { type: 'string' },
                    decimals: { type: 'number' },
                },
                minProperties: 4,
            },
            liquidity: { type: 'number' },
            liquidityUSD: { type: 'number' },
            newToken: { type: 'string' },
        },
        minProperties: 7,
    },
    trade: {
        type: 'object',
        properties: {
            chain: { type: 'string' },
            dex: { type: 'string' },
            pairAddress: { type: 'string' },
            senderAddress: { type: 'string' },
            senderLabel: { type: 'string' },
            token0: {
                type: { type: 'object' },
                properties: {
                    name: { type: 'string' },
                    symbol: { type: 'string' },
                    address: { type: 'string' },
                    order: { type: 'string' },
                    amount: { type: 'string' },
                    priceUSD: { type: 'string' },
                    coingecko: {
                        type: { type: 'object' },
                        properties: {
                            exists: { type: 'boolean' },
                            marketCapRank: { type: 'number' },
                        },
                        minProperties: 1,
                    },
                },
                minProperties: 7,
            },
            token1: {
                type: { type: 'object' },
                properties: {
                    name: { type: 'string' },
                    symbol: { type: 'string' },
                    address: { type: 'string' },
                    order: { type: 'string' },
                    amount: { type: 'string' },
                    priceUSD: { type: 'string' },
                    coingecko: {
                        type: { type: 'object' },
                        properties: {
                            exists: { type: 'boolean' },
                            marketCapRank: { type: 'number' },
                        },
                        minProperties: 1,
                    },
                },
                minProperties: 7,
            },
        },
        minProperties: 7,
    },
};

export default schemas;
