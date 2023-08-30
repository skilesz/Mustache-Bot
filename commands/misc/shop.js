const createShopSelect = require('../../utils/createShopSelect.js');

module.exports = {
  name: 'shop',
  description: 'Displays shop options',
  //devOnly: true,
  // testOnly: Boolean,
  // options: Object[],

  callback: async (client, interaction) => {
    await interaction.reply(createShopSelect('Alpha Enchantments'));
  }
};