import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import readyEvent from './events/ready.js';
import interactionCreateEvent from './events/interactionCreate.js';
import 'dotenv/config';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Get "commands" folder path
const commandsPath = join(__dirname, 'commands');

async function registerCommands() {
  const folders = await fs.readdir(commandsPath);

  // Get all "commands" subfolders
  for (const folder of folders) {
    const folderPath = join(commandsPath, folder);
    const commandFiles = (await fs.readdir(folderPath)).filter((file) =>
      file.endsWith('.js')
    );

    for (const file of commandFiles) {
      const filePath = join(folderPath, file);

      try {
        const { command } = await import(`file://${filePath}`);

        // Set a new item in the Collection with the key as the command name and the value as the imported module
        if (command && command.data && command.execute) {
          client.commands.set(command.data.name, command);
          console.log(`Added command => ${command.data.name}`);
        } else {
          console.error(
            `[WARNING] Command at ${filePath} is missing required properties.`
          );
        }
      } catch (error) {
        console.error(`Error loading the command at ${filePath}`, error);
      }
    }
  }
}

async function registerEvents() {
  client.once(readyEvent.name, (...args) => readyEvent.execute(...args));
  client.on(interactionCreateEvent.name, (...args) =>
    interactionCreateEvent.execute(...args)
  );
}

async function main() {
  await registerCommands();
  await registerEvents();

  client.login(DISCORD_TOKEN);
}

main().catch(console.error);
