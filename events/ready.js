// events/ready.js
import { Events } from 'discord.js';

const ready = {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};

export default ready;
