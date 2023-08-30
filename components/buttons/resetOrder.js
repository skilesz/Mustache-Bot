const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');

module.exports = {
  data: {
    name: 'resetOrder'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (resetOrder.js): Shop does not exist`)
      return;
    }

    const { shopCode } = shop;
    var message = await interaction.deferUpdate();

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (resetOrder.js): Order does not exist`)
        return;
      }

      order = shop.resetOrder(order);

      const orderForm = shop.createOrderForm(order);
      
      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (resetOrder.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (resetOrder.js): ${err}`);
    }
  }
};