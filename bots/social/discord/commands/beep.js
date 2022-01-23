import { SlashCommandBuilder } from '@discordjs/builders';

const event = {
    data: new SlashCommandBuilder().setName('beep').setDescription('Beep!'),
    async execute(interaction) {
        return interaction.reply('Boop!');
    },
};

export default event;
