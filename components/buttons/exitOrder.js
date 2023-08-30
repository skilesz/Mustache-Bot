const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');
const deleteOrder = require('../../utils/deleteOrder.js');

module.exports = {
  data: {
    name: 'exitOrder'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (exitOrder.js): Shop does not exist`)
      return;
    }

    const { shopCode } = shop;
    var message = await interaction.deferUpdate();

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (exitOrder.js): Order does not exist`)
        return;
      }

      const { id } = order;

      await deleteOrder(id, shopCode);

      await message.edit({
        content: `Order ${id} has been cancelled.`,
        components: []
      });
      
    } catch (err) {
      console.log(`ERROR (exitOrder.js): ${err}`);
    }
  }
};