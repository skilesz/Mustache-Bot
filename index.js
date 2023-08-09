const { Client, IntentsBitField, ActivityType } = require('discord.js');
const { statuses, chooseStatuses } = require('./utils/statuses.js');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', (c) => {
  console.log(c.user.tag + ' initialized!');

  chooseStatuses(client);
  setInterval(() => {
    chooseStatuses(client);
  }, 1000000);
});

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case 'add':
      var fo = interaction.options.get('first-number').value;
      var so = interaction.options.get('second-number').value;
      var sum = fo + so;
      interaction.reply(fo + ' + ' + so + ' = ' + sum);
  }
});

eventHandler(client);

client.login(process.env['TOKEN']);