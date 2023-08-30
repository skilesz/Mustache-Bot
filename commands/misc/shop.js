const createShopSelect = require('../../utils/createShopSelect.js');

module.exports = {
  name: (process.env['ENV'] == 'DEV') ? 'shop-dev' : 'shop',
  description: 'Displays shop options',
  devOnly: (process.env['ENV'] == 'DEV'),
  // testOnly: Boolean,
  // options: Object[],

  callback: async (client, interaction) => {
    await interaction.reply(createShopSelect('Alpha Enchantments'));
  }
};