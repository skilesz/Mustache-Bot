const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
  {
    name: 'add',
    description: 'Adds two numbers',
    options: [
      {
        name: 'first-number',
        description: 'First operand',
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: 'second-number',
        description: 'Second operand',
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ]
  },
  {
    name: 'hello',
    description: 'Sends user a random greeting',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env['TOKEN']);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env['CLIENT_ID'], process.env['GUILD_ID']),
      { body: commands }
    )

    console.log('Slash commands successfully registered!');
  } catch (err) {
    console.log('ERROR: ' + err);
  }
})();