const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');

module.exports = {
  data: {
    name: 'categorySelect'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (categorySelect.js): Shop does not exist`);
      return;
    }

    const { shopCode } = shop;
    var message = await interaction.deferUpdate();

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (categorySelect.js): Order does not exist`);
        return;
      }

      order = shop.selectCategory(order, interaction.values[0]);

      const orderForm = shop.createOrderForm(order);
      
      await message.edit(orderForm);

      await order.save().catch((e) => {
        console.log(`ERROR (categorySelect.js: order.save()): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (categorySelect.js): ${err}`);
    }
  }
};