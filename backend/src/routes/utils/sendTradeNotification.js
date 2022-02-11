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
const { ETH } = connections;

const getHookInfo = (chain, dex) => {
    let hook = {};

    switch (chain) {
        case 'ETH': {
            hook.img = ETH.img;
            hook.discordUrl = ETH.webhooks.newTrade;
            hook.explorerUrl = `${ETH.explorer.url}/token/`;
            if (dex === 'uniswap') {
                hook.dexUrl = ETH.dexes.uniswap.url;
            } else if (dex === 'sushiswap') {
                hook.dexUrl = ETH.dexes.sushiswap.url;
            } else {
                hook.dexUrl = '';
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

const sendTradeNotification = async (trade) => {
    const hook = getHookInfo(trade.chain, trade.dex);

    const webhookClient = new WebhookClient({
        url: hook.discordUrl,
    });

    let color = '';
    const valueUSD = trade.token.amount * trade.token.priceUSD;
    if (valueUSD >= 50000) {
        color = '#00ff00';
    } else if (valueUSD >= 5000) {
        color = '#ffff00';
    } else {
        color = '#ff0000';
    }

    const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${trade.token.symbol}`)
        .setURL(hook.dexUrl)
        .setAuthor({ name: `${trade.chain}-BOT`, iconURL: hook.img, url: 'https://discord.js.org' })
        .addFields(
            {
                name: 'Token information',
                value: `${trade.token.name} (${trade.token.symbol}), ${trade.token.address}, ${hook.explorerUrl}${trade.token.address}`,
            },
            {
                name: 'Trade information',
                value: `amount: ${trade.token.amount}, price per token: ${
                    trade.token.priceUSD
                }\ntotal trade value: $${valueUSD.toFixed(2)}\navailable on coingecko: ${trade.token.onCoingecko}`,
            },
            {
                name: 'Buyer information',
                value: `label: ${trade.senderLabel}\naddress: ${trade.senderAddress}`,
            },
            {
                name: 'Pair information',
                value: `${trade.pair}, ${trade.pairAddress}, ${hook.explorerUrl}${trade.pairAddress}`,
            }
        )
        .setTimestamp();

    webhookClient.send({
        username: 'trade tracker bot',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
        embeds: [embed],
    });

    // if (notificationWorthy(pair.liquidityUSD, pair.chain)) {
    //     let webhookNotificationClient = new WebhookClient({ url: process.env.discord_newPairHookUrl });
    //     webhookNotificationClient.send({
    //         username: 'liquidity pair bot',
    //         avatarURL: 'https://i.imgur.com/AfFp7pu.png',
    //         embeds: [embed],
    //     });

    //     // phone call here lol. wake the fuck up
    //     const cli = client(process.env.twilio_accountSid, process.env.twilio_authToken);
    //     await cli.calls.create({
    //         url: 'http://demo.twilio.com/docs/voice.xml',
    //         from: process.env.twilio_fromNumber,
    //         to: process.env.twilio_toNumber,
    //     });
    // }
};

export default sendTradeNotification;
