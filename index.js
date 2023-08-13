const { Client, IntentsBitField, ActivityType } = require('discord.js');
const { statuses, chooseStatuses } = require('./utils/statuses.js');
const eventHandler = require('./handlers/eventHandler');

// Specify intents
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Listen for onReady event, log and start status loop
client.on('ready', (c) => {
  console.log(c.user.tag + ' initialized!');

  chooseStatuses(client);
  setInterval(() => {
    chooseStatuses(client);
  }, 1000000);
});

// Run event handlers
eventHandler(client);

// Log into client
client.login(process.env['TOKEN']);