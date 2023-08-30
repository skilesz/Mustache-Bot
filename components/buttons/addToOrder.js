const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');

module.exports = {
  data: {
    name: 'addToOrder'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (addToOrder.js): Shop does not exist`)
      return;
    }

    const { shopCode } = shop;
    var message = await interaction.deferUpdate();

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (addToOrder.js): Order does not exist`)
        return;
      }

      order = shop.addToOrder(order);

      const orderForm = shop.createOrderForm(order);

      await message.edit(orderForm);
      
      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (addToOrder.js: save()): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (addToOrder.js): ${err}`);
    }
  }
};