const {SlashCommandBuilder} = require('@discordjs/builders');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const {clientId, guildId, token} = require('./src/config.js');

const commands = [
    new SlashCommandBuilder().setName('tama').setDescription('Replies with a random Tamagotchi device name'),
    new SlashCommandBuilder().setName('char').setDescription('Replies with a random Tamagotchi character name'),
]
    .map(command => command.toJSON());

console.log(commands)

const rest = new REST({version: '9'}).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

if (process.argv.includes('global')) {
    rest.put(Routes.applicationCommands(clientId), {body: commands})
        .then(() => console.log('Successfully registered global commands.'))
        .catch(console.error);

}
