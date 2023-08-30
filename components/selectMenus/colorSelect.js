const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');

module.exports = {
  data: {
    name: 'colorSelect'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (colorSelect.js): Shop does not exist`)
      return;
    }

    const { shopCode } = shop;
    var message = await interaction.deferUpdate();

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (colorSelect.js): Order does not exist`)
        return;
      }

      order.currentSelections.currentColor = interaction.values[0];

      const orderForm = shop.createOrderForm(order);
      
      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (colorSelect.js: order.save()): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (colorSelect.js): ${err}`);
    }
  }
};