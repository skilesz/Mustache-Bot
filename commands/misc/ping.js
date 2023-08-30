module.exports = {
  name: (process.env['ENV'] == 'DEV') ? 'ping-dev' : 'ping',
  description: 'Replies with bot ping',
  devOnly: (process.env['ENV'] == 'DEV'),
  // testOnly: Boolean,
  // options: Object[],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;
    
    interaction.editReply('Client ping: ' + ping + 'ms');
  }
};