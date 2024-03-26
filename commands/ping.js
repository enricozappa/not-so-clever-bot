import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

const cooldown = 5;

async function execute(interaction) {
  await interaction.reply('Pong!');
}

export const command = { data, execute, cooldown };
