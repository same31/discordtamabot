// Require the necessary discord.js classes
const {Client, Intents} = require('discord.js');
const {token} = require('./config.js');
const {devices} = require('./tamas.json');
const {getRandomCharacter} = require('./characters');

// Create a new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) {
        return;
    }

    const {commandName} = interaction;

    if (commandName === 'tama') {
        const name = devices[Math.floor(Math.random() * devices.length)];
        await interaction.reply(name);
    } else if (commandName === 'char') {
        const {img, name, link} = await getRandomCharacter();

        await interaction.reply(`[${name}](<${link}>)\n${img}`);
    }
});

// Login to Discord with your client's token
client.login(token);
