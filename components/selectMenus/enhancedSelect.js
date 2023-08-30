const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');

module.exports = {
  data: {
    name: 'enhancedSelect'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (enhancedSelect.js): Shop does not exist`)
      return;
    }

    const { shopCode } = shop;
    var message = await interaction.deferUpdate();

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (enhancedSelect.js): Order does not exist`)
        return;
      }

      order.currentSelections.currentEnhanced = interaction.values[0];

      const orderForm = shop.createOrderForm(order);
      
      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (enhancedSelect.js: order.save()): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (enhancedSelect.js): ${err}`);
    }
  }
};