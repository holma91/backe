import { MessageEmbed, WebhookClient } from 'discord.js';
import { config } from '../discord/config.js';

console.log(config.newPairHookUrl);
let webhookNotificationClient = new WebhookClient({ url: config.newPairHookUrl });
console.log(webhookNotificationClient);
webhookNotificationClient.send({
    username: 'liquidity pair bot',
    avatarURL: 'https://i.imgur.com/AfFp7pu.png',
    content: 'some content',
    // embeds: [embed],
});
