import { REST, Routes } from 'discord.js';
import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import 'dotenv/config';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.TEST_SERVER_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const foldersPath = join(dirname(fileURLToPath(import.meta.url)), 'commands');

// FIXME: Refactor using the new shared function "importModules"
async function loadCommands() {
  const commands = [];
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
          commands.push(command.data.toJSON());
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
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), // use "applicationCommands" to register global commands
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
