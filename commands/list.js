import { SlashCommandBuilder } from 'discord.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';

async function getJSONdata() {
  //TODO: make this as an importable utility function
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const projectRoot = join(currentDir, '..');

  try {
    const data = await fs.readFile(`${projectRoot}/data/data.json`, 'utf-8');

    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON:', err);
  }
}

const resourcesData = await getJSONdata();

const data = new SlashCommandBuilder()
  .setName('list')
  .setDescription('Show resources for Sea Of Thieves')
  .addStringOption((option) =>
    option
      .setName('resources')
      .setDescription('Select a resource')
      .setRequired(true)
      .addChoices(
        // TODO: generate command choices from json keys
        { name: 'Guides', value: 'SoT Guides' },
        { name: 'Maps', value: 'SoT Maps' }
      )
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
