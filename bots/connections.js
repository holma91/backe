import 'dotenv/config';

const connections = {
    BSC: {
        http: process.env.bsc_http,
        ws: process.env.bsc_ws,
    },
    ETH: {
        http: process.env.eth_http,
        ws: process.env.eth_ws,
    },
    EVMOS: {
        http: process.env.evmos_http,
        ws: process.env.evmos_ws,
    },
    FTM: {
        http: process.env.ftm_http,
        ws: process.env.ftm_ws,
    },
    AURORA: {
        http: process.env.aurora_http,
    },
    FUSE: {
        http: process.env.fuse_http,
    },
    METIS: {
        http: process.env.metis_http,
        ws: process.env.metis_ws,
    },
    OPTIMISM: {
        http: process.env.optimism_http,
        ws: process.env.optimism_ws,
    },
    ARBITRUM: {
        http: process.env.arbitrum_http,
    },
    AVAX: {
        http: process.env.avax_http,
        ws: process.env.avax_ws,
    },
    DFK: {
        http: process.env.dfk_http,
    },
    ROPSTEN: {
        http: process.env.ropsten_http,
        ws: process.env.ropsten_ws,
    },
};
export default connections;
