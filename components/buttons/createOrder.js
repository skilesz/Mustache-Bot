const findShop = require('../../utils/findShop.js');

module.exports = {
  data: {
    name: 'createOrder'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);
    
    if (!shop) {
      console.log(`WARNING (createOrder.js): Shop does not exist`);
      return;
    }
    
    var message = await interaction.deferUpdate();

    var order = shop.createOrder(client, interaction);

    const orderForm = shop.createOrderForm(order);
    
    await message.edit(orderForm);

    await order.save().catch((e) => {
      console.log(`ERROR (createOrder.js: order.save()): ${e}`);
    });
  }
};