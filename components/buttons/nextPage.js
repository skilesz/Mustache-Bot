const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');

module.exports = {
  data: {
    name: 'nextPage'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (nextPage.js): Shop does not exist`)
      return;
    }
    
    const { shopCode } = shop;

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (nextPage.js): Order does not exist`)
        return;
      }
      
      order = shop.nextPage(order);

      const orderForm = shop.createOrderForm(order);
      
      await interaction.update(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (nextPage.js: save()): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (nextPage.js): ${err}`);
    }
  }
};