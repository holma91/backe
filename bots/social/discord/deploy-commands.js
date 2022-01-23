import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from './config.js';
import commands from './commands/commands.js';
const { clientId, guildId, token } = config;

const actualCommands = [];
for (const command of commands) {
    actualCommands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: actualCommands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
