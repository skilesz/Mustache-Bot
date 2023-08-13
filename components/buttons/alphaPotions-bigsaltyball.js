module.exports = {
  data: {
    name: 'alphaPotions-bigsaltyball'
  },
  async execute(client, interaction) {
    await interaction.reply({
      content: `Welcome to Alpha Potions!`
    });
  }
}