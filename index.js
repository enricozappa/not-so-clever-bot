import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ready from './events/ready.js';
import interactionCreate from './events/interactionCreate.js';
import 'dotenv/config';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Get "commands" folder path
const foldersPath = join(dirname(fileURLToPath(import.meta.url)), 'commands');

(async () => {
  const folders = await fs.readdir(foldersPath);
  // Get all "commands" subfolders
  for (const folder of folders) {
    const commandsPath = join(foldersPath, folder);
    const commandFiles = await fs.readdir(commandsPath);
    const jsFiles = commandFiles.filter((file) => file.endsWith('.js'));

    for (const file of jsFiles) {
      const filePath = join(commandsPath, file);

      try {
        const module = await import(`file://${filePath}`);
        const command = module.command;

        // Set a new item in the Collection with the key as the command name and the value as the imported module
        if (command && command.data && command.execute) {
          client.commands.set(command.data.name, command);
          console.log(`Added command => ${command.data.name}`);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      } catch (error) {
        console.error(`Error loading the command at ${filePath}`, error);
      }
    }
  }
})();

// When the client is ready, log a message
client.once(Events.ClientReady, () => ready.execute(client));

// Log in to Discord using token
client.login(DISCORD_TOKEN);

// Listen for interaction
client.on(Events.InteractionCreate, async (interaction) => {
  await interactionCreate.execute(interaction);
});
