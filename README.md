# not-so-clever-bot

A playfully inadequate Discord bot built with:

- [Node.js](https://nodejs.org) - Popular JavaScript runtime environment
- [discord.js](https://discord.js.org/) - a Node.js module to build Discord bots through Discord API

This bot simply reads from a JSON file to provide resources based on the received command.

![](https://firebasestorage.googleapis.com/v0/b/sot-videos.appspot.com/o/not-so-clever.gif?alt=media&token=f934fc88-1533-4746-ad7a-b4b0b2f20eb6)

This simple idea was born during a company hackathon. My intention was to create a bot that would contain links to various sections of our company's documentation. By doing so, it could directly speed up the search for specific topics on Discord, avoiding the need to search manually.

In this demo, the JSON file contains links to resources related to the popular video game "Sea Of Thieves."

The example commands are:
- `/list` followed by the subcommands `Guides` to get the SoT guides links or `Maps` to get the maps  
- `/search` followed by a query word to search anything inside the json matching that word  

## Getting Started

To run the project, you'll need to:

1. Clone the repository.
2. Ensure you have Node.js version 20.11 or higher installed.
3. Create a `.env` file in the root of the project with the following constants:
   - `DISCORD_TOKEN=yourdiscordtoken`
   - `CLIENT_ID=yourclientid`
   - `SERVER_ID=yourserverid`
4. When everything is set, run `node index.js` to start the bot

Additionally, it's essential to follow the guide at [Discord Developers Portal](https://discord.com/developers) to create your bot application and associate it with your Discord channel. Here, you can generate your tokens and IDs to be inserted into the `.env` file.

For developing the application, I followed this excellent documentation: [Discord.js Docs](https://discord.js.org/docs/packages/discord.js/main). The only issue with this documentation is that the code examples are in ES5, so I had to adapt some approaches to use more modern methods.
