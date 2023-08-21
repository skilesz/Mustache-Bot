const { devs, testServer } = require('../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

    if (!commandObject) return;

    // Check if devOnly
    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        await interaction.reply({
          content: 'DEV: Only devs can run this command',
          ephemeral: true,
        });
        return;
      }
    }

    // Check if testOnly
    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        await interaction.reply({
          content: 'TEST: This command cannot be run here',
          ephemeral: true,
        });
        return;
      }
    }

    // Check permissions
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          await interaction.reply({
            content: 'PERM: You do not have permission to run this command',
            ephemeral: true,
          });
          return;
        }
      }
    }

    // Check bot permissions
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;
        
        if (!bot.permissions.has(permission)) {
          await interaction.reply({
            content: 'PERM: Bot does not have permission to run this command',
            ephemeral: true,
          });
          return;
        }
      }
    }

    // Run command function
    await commandObject.callback(client, interaction);
  } catch (err) {
    console.log('ERROR (handleCommands.js): ' + err);
  }
};