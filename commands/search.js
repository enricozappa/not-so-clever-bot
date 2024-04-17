import { SlashCommandBuilder } from 'discord.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';
import searchLinks from '../utilities/searchLinks.js';

async function getJSONdata() {
  // TODO: Make this an importable utility function
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
  .setName('search')
  .setDescription('Search for a resource')
  .addStringOption((option) =>
    option
      .setName('query')
      .setDescription('Enter your search query')
      .setRequired(true)
  );

async function execute(interaction) {
  try {
    // Get the user-provided input
    const query = interaction.options.getString('query');

    // Search through data
    const queryResult = searchLinks(resourcesData, query);

    console.log(
      '\x1b[36m%s\x1b[0m',
      `${interaction.user.username} is searching for "${query}"`
    );

    if (Object.keys(queryResult).length) {
      let response = `Here are the resource for "${query}":\n`;
      for (const [name, link] of Object.entries(queryResult)) {
        response += `- [${name}](<${link}>)\n`;
      }

      return await interaction.reply(response);
    }

    return await interaction.reply(`No resource found for "${query}"`);
  } catch (error) {
    console.error(error);
  }
}

export const command = { data, execute };
