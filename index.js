// Require the necessary discord.js classes
const {Client, Intents} = require('discord.js');
const {token} = require('./config.js');
const {devices} = require('./tamas.json');
const { random } = require('./random');
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
        const name = devices[Math.floor(random() * devices.length)];
        await interaction.reply(name);
    } else if (commandName === 'char') {
        const character = await getRandomCharacter();

        if (!character) {
            await interaction.reply('Not yet initialised, please wait a few seconds...');
        } else {
            const {img, name, link} = character;
            await interaction.reply(`[${name}](<${link}>)\n${img}`);
        }
    }
});

// Login to Discord with your client's token
client.login(token);
