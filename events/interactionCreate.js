import { Events, Collection } from 'discord.js';

export const event = {
  name: Events.InteractionCreate,

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    const { cooldowns } = interaction.client;

    // Ensure there is a cooldown set for the command
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3; // Default cooldown in seconds
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    // Check if the user is on cooldown
    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = expirationTime - now;

        return interaction.reply({
          content: `Please wait ${Math.round(
            timeLeft / 1000
          )} more second(s) before reusing the \`${
            command.data.name
          }\` command.`,
          ephemeral: true,
        });
      }
    }

    // Set the timestamp for the user
    timestamps.set(interaction.user.id, now);
    // Automatically delete the timestamp after the cooldown expires
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction);
      // console.log(interaction.user);
    } catch (error) {
      console.error(error);

      const replyMessage = 'There was an error while executing this command!';

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: replyMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: replyMessage, ephemeral: true });
      }
    }
  },
};
