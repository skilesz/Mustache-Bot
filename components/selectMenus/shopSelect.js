const createShopSelect = require('../../utils/createShopSelect.js');

module.exports = {
  data: {
    name: 'shopSelect'
  },
  async execute(client, interaction) {
    await interaction.update(createShopSelect(interaction.values[0]));
  }
}