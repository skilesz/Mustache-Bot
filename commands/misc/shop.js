const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'shop',
  description: 'Displays shop options',
  devOnly: true,
  // testOnly: Boolean,
  // options: Object[],

  callback: async (client, interaction) => {
    const alphaPotionsButton = new ButtonBuilder()
      .setCustomId('alphaPotions')
      .setLabel('Alpha Potions')
      .setStyle(ButtonStyle.Primary);

    const alphaEnchantmentsButton = new ButtonBuilder()
      .setCustomId('alphaEnchantments')
      .setLabel('Alpha Enchantments')
      .setStyle(ButtonStyle.Primary);

    await interaction.reply({
      content: '**Welcome to Mustache Marketplace!\n' +
        'Please choose a shop:',
      components: [ new ActionRowBuilder().addComponents(alphaPotionsButton, alphaEnchantmentsButton) ]
    });
  },
};