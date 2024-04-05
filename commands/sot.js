import { SlashCommandBuilder } from 'discord.js';

// TODO: move to an external JSON file
const sotData = {
  'SoT Guides': {
    'Rare Thief Guide': 'https://rarethief.com/sea-of-thieves-guides',
    'SoT Wiki': 'https://seaofthieves.fandom.com/wiki/Sea_of_Thieves_Wiki',
  },
  'SoT Maps': {
    'SoT Companion Map': 'https://maps.seaofthieves.rarethief.com',
    'Sea Of Thieves Map': 'https://www.seaofthievesmap.info',
    'IGN SoT Map': 'https://www.ign.com/maps/sea-of-thieves/interactive',
    "Merfolk's Lullaby":
      'https://www.merfolkslullaby.com/map?latitude=18.63&longitude=-64.42&zoom=11&realm=sea-of-thieves',
    'Steam Community All Island':
      'https://steamcommunity.com/sharedfiles/filedetails/?id=2304041443',
  },
};

const data = new SlashCommandBuilder()
  .setName('sot')
  .setDescription('Show resources for Sea Of Thieves')
  .addStringOption((option) =>
    option
      .setName('resources')
      .setDescription('Select a resource')
      .setRequired(true)
      .addChoices(
        { name: 'Guides', value: 'SoT Guides' },
        { name: 'Maps', value: 'SoT Maps' }
      )
  );

async function execute(interaction) {
  const selectedResource = interaction.options.getString('resources');

  try {
    if (selectedResource in sotData) {
      const filteredObject = sotData[selectedResource];

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
