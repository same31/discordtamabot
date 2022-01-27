// Require the necessary discord.js classes
const {Client, Intents} = require('discord.js');
const {token} = require('./config.js');
const {devices} = require('./tamas.json');

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
        const name = Math.floor(Math.random() * devices.length);
        await interaction.reply(name);
    }
});

// Login to Discord with your client's token
client.login(token);
