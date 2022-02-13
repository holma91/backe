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
const { BSC, ETH, FTM, AVAX, AURORA, FUSE, METIS, OPTIMISM, ARBITRUM } = connections;

const dexscreenerUrl = 'https://dexscreener.com';

const getHookInfo = (chain, dex) => {
    let hook = {};

    switch (chain) {
        case 'ETH': {
            hook.img = ETH.img;
            hook.discordUrl = ETH.webhooks.newTrade;
            hook.explorerUrl = `${ETH.explorer.url}/token`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/ethereum`;
            hook.nativeToken = 'WETH';
            if (dex === 'uniswap') {
                hook.dexUrl = ETH.dexes.uniswap.url;
            } else if (dex === 'sushiswap') {
                hook.dexUrl = ETH.dexes.sushiswap.url;
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'BSC': {
            hook.img = BSC.img;
            hook.discordUrl = BSC.webhooks.newTrade;
            hook.explorerUrl = `${BSC.explorer.url}/token`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/bsc`;
            hook.nativeToken = 'WBNB';
            if (dex === 'pancakeswap') {
                hook.dexUrl = BSC.dexes.pancakeswap.url;
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'FTM': {
            hook.img = FTM.img;
            hook.discordUrl = FTM.webhooks.newTrade;
            hook.explorerUrl = `${FTM.explorer.url}/token`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/fantom`;
            hook.nativeToken = 'WFTM';
            if (dex === 'spookyswap') {
                hook.dexUrl = FTM.dexes.spookyswap.url;
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'AVAX': {
            hook.img = AVAX.img;
            hook.discordUrl = AVAX.webhooks.newTrade;
            hook.explorerUrl = `${AVAX.explorer.url}/token`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/avalanche`;
            hook.nativeToken = 'WAVAX';
            if (dex === 'traderjoe') {
                hook.dexUrl = AVAX.dexes.uniswap.url;
            } else if (dex === 'pangolin') {
                hook.dexUrl = AVAX.dexes.sushiswap.url;
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'AURORA': {
            hook.img = AURORA.img;
            hook.discordUrl = AURORA.webhooks.newTrade;
            hook.explorerUrl = `${AURORA.explorer.url}/token`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/aurora`;
            hook.nativeToken = 'WETH';
            if (dex === 'trisolaris') {
                hook.dexUrl = AURORA.dexes.trisolaris.url;
            } else {
                hook.dexUrl = '';
            }
            break;
        }
        case 'FUSE': {
            hook.img = FUSE.img;
            hook.greenUrl = FUSE.webhooks.newTrade;
            hook.explorerUrl = `${FUSE.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/fuse`;
            hook.nativeToken = 'WFUSE';
            if (dex === 'fuse.fi') {
                hook.dexUrl = FUSE.dexes.fusefi.url;
            }
            break;
        }
        case 'METIS': {
            hook.img = METIS.img;
            hook.greenUrl = METIS.webhooks.newTrade;
            hook.explorerUrl = `${METIS.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/metis`;
            hook.nativeToken = 'METIS';
            if (dex === 'netswap') {
                hook.dexUrl = METIS.dexes.netswap.url;
            } else if (dex === 'tethys') {
                hook.dexUrl = METIS.dexes.tethys.url;
            }
            break;
        }
        case 'OPTIMISM': {
            hook.img = OPTIMISM.img;
            hook.greenUrl = OPTIMISM.webhooks.newTrade;
            hook.explorerUrl = `${OPTIMISM.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/optimism`;
            hook.nativeToken = 'WETH';
            if (dex === 'zipswap') {
                hook.dexUrl = OPTIMISM.dexes.zipswap.url;
            }
            break;
        }
        case 'ARBITRUM': {
            hook.img = ARBITRUM.img;
            hook.greenUrl = ARBITRUM.webhooks.newTrade;
            hook.explorerUrl = `${ARBITRUM.explorer.url}/token/`;
            hook.dexscreenerUrl = `${dexscreenerUrl}/optimism`;
            hook.nativeToken = 'WETH';
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

const notificationWorthy = (trade, valueUSD) => {
    // do research here to determine
    return !trade.token.coingecko.exists;
};

const sendTradeNotification = async (trade) => {
    // do not send anything if native token or stablecoin

    const hook = getHookInfo(trade.chain, trade.dex);

    if ([hook.nativeToken, 'USDC', 'USDT', 'BUSD', 'UST', 'DAI'].includes(trade.token.symbol)) return;

    const webhookClient = new WebhookClient({
        url: hook.discordUrl,
    });

    let color = '';
    const valueUSD = trade.token.amount * trade.token.priceUSD;
    if (!trade.token.coingecko.exists) {
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
        .setTitle(`${trade.token.symbol} bought by ${trade.senderLabel}`)
        .setURL(hook.dexUrl)
        .setAuthor({ name: `${trade.chain}-BOT`, iconURL: hook.img, url: 'https://discord.js.org' })
        .addFields(
            {
                name: 'Token information',
                value: `${trade.token.name} (${trade.token.symbol})\n${trade.token.address}\n${hook.explorerUrl}/${
                    trade.token.address
                }\navailable on coingecko: ${trade.token.coingecko.exists}
                \nmarket cap rank: ${trade.token.coingecko.exists ? trade.token.coingecko.marketCapRank : 'N/A'}`,
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
                value: `${trade.pair}\n${trade.pairAddress}\n${hook.explorerUrl}/${trade.pairAddress}\n${hook.dexscreenerUrl}/${trade.pairAddress}`,
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
