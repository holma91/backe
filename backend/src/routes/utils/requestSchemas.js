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
            pairAddress: { type: 'string' },
            senderAddress: { type: 'string' },
            token0: {
                type: { type: 'object' },
                properties: {
                    symbol: { type: 'string' },
                    address: { type: 'string' },
                    order: { type: 'string' },
                    amount: { type: 'string' },
                    priceUSD: { type: 'string' },
                    onCoingecko: { type: 'boolean' },
                },
                minProperties: 6,
            },
            token1: {
                type: { type: 'object' },
                properties: {
                    symbol: { type: 'string' },
                    address: { type: 'string' },
                    order: { type: 'string' },
                    amount: { type: 'string' },
                    priceUSD: { type: 'string' },
                    onCoingecko: { type: 'boolean' },
                },
                minProperties: 6,
            },
        },
        minProperties: 5,
    },
};

export default schemas;
