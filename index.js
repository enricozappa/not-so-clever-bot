import { Client, Events, GatewayIntentBits } from 'discord.js';
import { pingCommand } from './commands/utility/ping.js';
import { userCommand } from './commands/utility/user.js';
import 'dotenv/config';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const TEST_SERVER_ID = process.env.TEST_SERVER_ID;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, log a message
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord using token
client.login(DISCORD_TOKEN);
