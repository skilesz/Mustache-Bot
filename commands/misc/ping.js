module.exports = {
  name: 'ping',
  description: 'Replies with bot ping',
  // devOnly: Boolean,
  // testOnly: Boolean,
  // options: Object[],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;
    
    interaction.editReply('Client ping: ' + ping + 'ms');
  }
};