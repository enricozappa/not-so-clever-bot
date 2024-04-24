import { SlashCommandBuilder } from 'discord.js';
import getJSONdata from '../utilities/getJSONdata.js';
import generateSubcommands from '../utilities/generateSubcommands.js';

const resourcesData = await getJSONdata();

// Generate command choices from json keys
const choices = generateSubcommands(resourcesData);

// Initialize command data
const data = new SlashCommandBuilder()
  .setName('list')
  .setDescription('Show resources by category')
  .addStringOption((option) =>
    option
      .setName('resources')
      .setDescription('Select a resource')
      .setRequired(true)
      .addChoices(...choices)
  );

async function execute(interaction) {
  const selectedResource = interaction.options.getString('resources');

  try {
    if (selectedResource in resourcesData) {
      const filteredObject = resourcesData[selectedResource];

      console.log(
        '\x1b[36m%s\x1b[0m',
        `${interaction.user.username} requested ${selectedResource}`
      );

      let response = `Here are the ${selectedResource}:\n`;
      for (const [name, link] of Object.entries(filteredObject)) {
        response += `- [${name}](<${link}>)\n`;
      }

      await interaction.reply(response);
    } else {
      await interaction.reply(`No resource found for ${selectedResource}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export const command = { data, execute };
