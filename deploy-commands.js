import { REST, Routes } from 'discord.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import importModules from './utilities/importModules.js';
import 'dotenv/config';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.SERVER_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const foldersPath = join(dirname(fileURLToPath(import.meta.url)), 'commands');

async function loadCommands() {
  const commands = [];
  const modules = await importModules('commands');

  modules.forEach((command) => {
    if (command && command.data && command.execute) {
      commands.push(command.data.toJSON());
    } else {
      console.error(
        `[WARNING] Command at ${filePath} is missing required properties.`
      );
    }
  });

  return commands;
}

async function deployCommands() {
  const commands = await loadCommands(foldersPath);

  try {
    const rest = new REST().setToken(DISCORD_TOKEN);

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
}

deployCommands();
