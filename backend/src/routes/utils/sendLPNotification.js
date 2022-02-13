import { createRequire } from 'module'; // Bring in the ability to create the 'require' method in es6 modules
const require = createRequire(import.meta.url); // construct the require method
const path = require('path');
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const client = require('twilio');

import { MessageEmbed, WebhookClient } from 'discord.js';
import connections from '../../connections.js';
const { BSC, ETH, FTM, AVAX, AURORA, FUSE, METIS, OPTIMISM, ARBITRUM } = connections;
const dexscreenerUrl = 'https://dexscreener.com';

const getHookInfo = (chain, dex) => {
    let hook = {};

    switch (chain) {
        case 'BSC': {
            hook.img = BSC.img;
            hook.greenUrl = BSC.webhooks.newPair;
            hook.explorerUrl = `${BSC.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/bsc`;
            if (dex === 'pancakeswap') {
                hook.dexUrl = BSC.dexes.pancakeswap.url;
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'ETH': {
            hook.img = ETH.img;
            hook.greenUrl = ETH.webhooks.newPair;
            hook.explorerUrl = `${ETH.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/ethereum`;
            if (dex === 'uniswapV2') {
                hook.dexUrl = ETH.dexes.uniswap.url;
            } else if (dex === 'sushiswap') {
                hook.dexUrl = ETH.dexes.sushiswap.url;
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'AVAX': {
            hook.img = AVAX.img;
            hook.greenUrl = AVAX.webhooks.newPair;
            hook.explorerUrl = `${AVAX.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/avalanche`;
            if (dex === 'traderjoe') {
                hook.dexUrl = AVAX.dexes.uniswap.url;
            } else if (dex === 'pangolin') {
                hook.dexUrl = AVAX.dexes.sushiswap.url;
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'FTM': {
            hook.img = FTM.img;
            hook.greenUrl = FTM.webhooks.newPair;
            hook.explorerUrl = `${FTM.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/fantom`;
            if (dex === 'spookyswap') {
                hook.dexUrl = FTM.dexes.spookyswap.url;
            } else if (dex === 'spiritswap') {
                hook.dexUrl = FTM.dexes.spiritswap.url;
            }
            break;
        }
        case 'AURORA': {
            hook.img = AURORA.img;
            hook.greenUrl = AURORA.webhooks.newPair;
            hook.explorerUrl = `${AURORA.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/aurora`;
            if (dex === 'trisolaris') {
                hook.dexUrl = AURORA.dexes.trisolaris.url;
            } else if (dex == 'wannaswap') {
                hook.dexUrl = AURORA.dexes.wannaswap.url;
            }
            break;
        }
        case 'FUSE': {
            hook.img = FUSE.img;
            hook.greenUrl = FUSE.webhooks.newPair;
            hook.explorerUrl = `${FUSE.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/fuse`;
            if (dex === 'fuse.fi') {
                hook.dexUrl = FUSE.dexes.fusefi.url;
            }
            break;
        }
        case 'METIS': {
            hook.img = METIS.img;
            hook.greenUrl = METIS.webhooks.newPair;
            hook.explorerUrl = `${METIS.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/metis`;
            if (dex === 'netswap') {
                hook.dexUrl = METIS.dexes.netswap.url;
            } else if (dex === 'tethys') {
                hook.dexUrl = METIS.dexes.tethys.url;
            }
            break;
        }
        case 'OPTIMISM': {
            hook.img = OPTIMISM.img;
            hook.greenUrl = OPTIMISM.webhooks.newPair;
            hook.explorerUrl = `${OPTIMISM.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/optimism`;
            if (dex === 'zipswap') {
                hook.dexUrl = OPTIMISM.dexes.zipswap.url;
            }
            break;
        }
        case 'ARBITRUM': {
            hook.img = ARBITRUM.img;
            hook.greenUrl = ARBITRUM.webhooks.newPair;
            hook.explorerUrl = `${ARBITRUM.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/optimism`;
            if (dex === 'sushiswap') {
                hook.dexUrl = ARBITRUM.dexes.sushiswap.url;
            }
            break;
        }

        default:
            break;
    }
    return hook;
};

const notificationWorthy = (liquidityUSD, chain) => {
    // do research here to determine
    let worthy = false;
    switch (chain) {
        case 'ETH': {
            if (liquidityUSD >= 500000) {
                worthy = true;
            }
            break;
        }
        case 'AURORA': {
            if (liquidityUSD >= 15000) {
                worthy = true;
            }
            break;
        }
        case 'FUSE': {
            if (liquidityUSD >= 15000) {
                worthy = true;
            }
            break;
        }
        case 'METIS': {
            if (liquidityUSD >= 15000) {
                worthy = true;
            }
            break;
        }
        case 'OPTIMISM': {
            if (liquidityUSD >= 15000) {
                worthy = true;
            }
            break;
        }
    }
    return worthy;
};

const sendLPNotification = async (pair) => {
    const hook = getHookInfo(pair.chain, pair.dex);

    const webhookClient = new WebhookClient({
        url: hook.greenUrl,
    });

    let color = '';
    if (pair.liquidityUSD >= 50000) {
        color = '#00ff00';
    } else if (pair.liquidityUSD >= 10000) {
        color = '#ffff00';
    } else {
        color = '#ff0000';
    }

    let symbolOldToken = '';
    let symbolNewToken = '';
    let nameNewToken = '';
    let addressNewToken = '';
    if (pair.newToken === 'token0') {
        symbolOldToken = pair.token1.symbol;
        symbolNewToken = pair.token0.symbol;
        nameNewToken = pair.token0.name;
        addressNewToken = pair.token0.address;
    } else if (pair.newToken === 'token1') {
        symbolOldToken = pair.token0.symbol;
        symbolNewToken = pair.token1.symbol;
        nameNewToken = pair.token1.name;
        addressNewToken = pair.token1.address;
    }

    const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${symbolOldToken}/${symbolNewToken}`)
        .setURL(hook.dexUrl)
        .setAuthor({ name: `${pair.chain}-BOT`, iconURL: hook.img, url: 'https://discord.js.org' })
        .addFields(
            {
                name: 'Pair information',
                value: `${symbolOldToken}/${symbolNewToken}\n${pair.address}\n${hook.explorerUrl}${pair.address}\n\n${hook.dexscreenerUrl}/${pair.address}`,
            },
            {
                name: 'Token information',
                value: `${nameNewToken} (${symbolNewToken})\n${addressNewToken}\n${hook.explorerUrl}${addressNewToken}`,
            },
            {
                name: 'Liquidity information',
                value: `liquidity (${symbolOldToken}, USD): ${pair.liquidity.toFixed(2)}, $${pair.liquidityUSD.toFixed(
                    2
                )}`,
            }
        )
        .setTimestamp();

    webhookClient.send({
        username: 'liquidity pair bot',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
        embeds: [embed],
    });

    if (notificationWorthy(pair.liquidityUSD, pair.chain)) {
        let webhookNotificationClient = new WebhookClient({ url: process.env.discord_newPairHookUrl });
        webhookNotificationClient.send({
            username: 'liquidity pair bot',
            avatarURL: 'https://i.imgur.com/AfFp7pu.png',
            embeds: [embed],
        });

        // phone call here lol. wake the fuck up
        const cli = client(process.env.twilio_accountSid, process.env.twilio_authToken);
        await cli.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml',
            from: process.env.twilio_fromNumber,
            to: process.env.twilio_toNumber,
        });
    }
};

export default sendLPNotification;
