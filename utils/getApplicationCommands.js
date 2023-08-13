module.exports = async (client, guildId) => {
  var applicationCommands;
  var result = [];

  // Get application command manager
  if (guildId) {
    const guild = await client.guilds.fetch(guildId);
    applicationCommands = guild.commands;
  } else {
    applicationCommands = await client.application.commands;
  }
  
  // Return application command manager
  return applicationCommands;
};