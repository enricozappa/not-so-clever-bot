# not-so-clever-bot

A playfully inadequate Discord bot built with Node.js and Discord.js.

It simply reads from a JSON file to provide resources based on the received command.

![](https://s12.gifyu.com/images/SZHaI.gif)

This simple idea was born during a company hackathon. My intention was to create a bot that would contain links to various sections of our company's documentation. By doing so, it could directly speed up the search for specific topics on Discord, avoiding the need to search manually.

In this demo, the JSON file contains links to resources related to the popular video game "Sea Of Thieves."

## Getting Started

To run the project, you'll need to:

1. Clone the repository.
2. Ensure you have Node.js version 20.11 or higher installed.
3. Create a `.env` file in the root of the project with the following constants:
   - `DISCORD_TOKEN=yourdiscordtoken`
   - `CLIENT_ID=yourclientid`
   - `SERVER_ID=yourserverid`
4. When everything is set, run `node index.js` to start the bot

Additionally, it's essential to follow the guide at ![Discord Developer Portal](https://discord.com/developers) to create your bot application and associate it with your Discord channel. Here, you can generate your tokens and IDs to be inserted into the `.env` file.

For developing the application, I followed this excellent documentation: ![Discord.js Guide](https://discord.js.org/docs/packages/discord.js/main). The only issue with this documentation is that the code examples are in ES5, so I had to adapt some approaches to use more modern methods.
