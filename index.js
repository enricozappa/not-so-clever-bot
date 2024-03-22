import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

async function registerCommands() {
  // Get commands modules from "commands" folder
  const modules = await importModules('commands');

  modules.forEach((command) => {
    // Set a new item in the Collection with the key as the command name and the value as the imported module
    if (command && command.data && command.execute) {
      client.commands.set(command.data.name, command);
      console.log(`Added command => ${command.data.name}`);
    } else {
      console.error(
        `[WARNING] Command at ${filePath} is missing required properties.`
      );
    }
  });
}

async function registerEvents() {
  // Get events modules from "events" folder
  const modules = await importModules('events');

  modules.forEach((event) => {
    if (event.name && event.execute) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      console.log(`Added event => ${event.name}`);
    } else {
      console.error(
        `[WARNING] Event at ${filePath} is missing required properties.`
      );
    }
  });
}

async function main() {
  await registerCommands();
  await registerEvents();

  client.login(DISCORD_TOKEN);
}

main().catch(console.error);

// TODO: move to an external file
async function importModules(folderName) {
  const modules = [];
  const __dirname = dirname(fileURLToPath(import.meta.url));

  try {
    const folderPath = join(__dirname, folderName);
    const files = (await fs.readdir(folderPath)).filter((file) =>
      file.endsWith('.js')
    );

    for (const file of files) {
      const filePath = join(folderPath, file);
      const module = await import(`file://${filePath}`);

      modules.push(module?.event || module?.command);
    }

    return modules;
  } catch (error) {
    console.error('Error loading files =>', error);
  }
}
