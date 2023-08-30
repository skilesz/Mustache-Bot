const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');

module.exports = {
  data: {
    name: 'levelSelect'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (levelSelect.js): Shop does not exist`)
      return;
    }

    const { shopCode } = shop;

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (levelSelect.js): Order does not exist`)
        return;
      }

      order.currentSelections.currentLevel = interaction.values[0];

      const orderForm = shop.createOrderForm(order);
      
      await interaction.update(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (levelSelect.js: order.save()): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (levelSelect.js): ${err}`);
    }
  }
};