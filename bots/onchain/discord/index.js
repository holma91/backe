import events from './events/events.js';
import commands from './commands/commands.js';
import { Client, Collection, Intents, MessageEmbed, WebhookClient } from 'discord.js';
import { config } from './config.js';
const { token } = config;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
for (const command of commands) {
    client.commands.set(command.data.name, command);
}

for (const event of events) {
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);

export default client;
