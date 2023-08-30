const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');

module.exports = {
  data: {
    name: 'nameSelect'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (nameSelect.js): Shop does not exist`);
      return;
    }

    const { shopCode } = shop;
    var message = await interaction.deferUpdate();

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (nameSelect.js): Order does not exist`);
        return;
      }

      order = shop.selectName(order, interaction.values[0]);

      const orderForm = shop.createOrderForm(order);
      
      await message.edit(orderForm);

      await order.save().catch((e) => {
        console.log(`ERROR (nameSelect.js: order.save()): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (nameSelect.js): ${err}`);
    }
  }
};