import { createRequire } from 'module'; // Bring in the ability to create the 'require' method in es6 modules
const require = createRequire(import.meta.url); // construct the require method
const path = require('path');
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// const client = require('twilio');

import { MessageEmbed, WebhookClient } from 'discord.js';
import connections from '../../connections.js';
import { log } from 'console';
const { ETH } = connections;

const dexscreenerUrl = 'https://dexscreener.com';

const getHookInfo = (chain, dex) => {
    let hook = {};

    switch (chain) {
        case 'ETH': {
            hook.img = ETH.img;
            hook.discordUrl = ETH.webhooks.newTrade;
            hook.explorerUrl = `${ETH.explorer.url}/token`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/ethereum`;
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

const notificationWorthy = (trade, valueUSD) => {
    // do research here to determine
    let worthy = false;
    switch (trade.chain) {
        case 'ETH': {
            if (!trade.token.onCoingecko) {
                worthy = true;
            } else if (valueUSD >= 500000) {
                worthy = true;
            }
            break;
        }
        default:
            break;
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
    if (!trade.token.onCoingecko) {
        color = '#f207e7';
    } else if (valueUSD >= 50000) {
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
                value: `${trade.token.name} (${trade.token.symbol})\n${trade.token.address}\n${hook.explorerUrl}/${trade.token.address}\navailable on coingecko: ${trade.token.onCoingecko}`,
            },
            {
                name: 'Trade information',
                value: `amount: ${trade.token.amount}, price per token: ${
                    trade.token.priceUSD
                }\ntotal trade value: $${valueUSD.toFixed(2)}`,
            },
            {
                name: 'Buyer information',
                value: `label: ${trade.senderLabel}\naddress: ${trade.senderAddress}`,
            },
            {
                name: 'Pair information',
                value: `${trade.pair}\n${trade.pairAddress}\n${hook.explorerUrl}${trade.pairAddress}\n${hook.dexscreenerUrl}/${trade.token.address}`,
            }
        )
        .setTimestamp();

    webhookClient.send({
        username: 'trade tracker bot',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
        embeds: [embed],
    });

    if (notificationWorthy(trade, valueUSD)) {
        let webhookNotificationClient = new WebhookClient({ url: process.env.discord_newTradeHookUrl });
        webhookNotificationClient.send({
            username: 'trade tracker bot',
            avatarURL: 'https://i.imgur.com/AfFp7pu.png',
            embeds: [embed],
        });

        // phone call here lol. wake the fuck up
        // const cli = client(process.env.twilio_accountSid, process.env.twilio_authToken);
        // await cli.calls.create({
        //     url: 'http://demo.twilio.com/docs/voice.xml',
        //     from: process.env.twilio_fromNumber,
        //     to: process.env.twilio_toNumber,
        // });
    }
};

export default sendTradeNotification;
