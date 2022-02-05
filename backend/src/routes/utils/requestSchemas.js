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
};

export default schemas;
