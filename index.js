const { Client, Collection, IntentsBitField } = require('discord.js');
const { chooseStatuses } = require('./utils/statuses.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const componentHandler = require('./handlers/componentHandler');

// Specify intents
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();

// Listen for onReady event, log and start status loop
client.once('ready', (c) => {
  console.log(c.user.tag + ' initialized!');

  chooseStatuses(client);
  setInterval(() => {
    chooseStatuses(client);
  }, 1000000);
});

// Connet to MongoDB
(async () => {
  try {
    await mongoose.connect(process.env['MONGODB']);
    console.log('Connected to DB!');
  
  } catch (err) {
    console.log(`ERROR (index.js): ${err}`);
  }
})();

// Run handlers
eventHandler(client);
componentHandler(client);

// Log into client
client.login(process.env['TOKEN']);