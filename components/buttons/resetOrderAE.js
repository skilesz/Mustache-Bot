const createOrderForm = require('../../utils/createOrderFormAE.js');
const OrderAE = require('../../schemas/OrderAE.js');

module.exports = {
  data: {
    name: 'resetOrderAE'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAE.findOne(query);

      if (!order) {
        console.log('WARNING (resetOrderAE.js): Order does not exist')
        return;
      }

      order.currentSelections = {
        currentName: 'Mending',
        currentLevel: 'I',
        currentPage: 1
      };

      order.totalPrice = {
        totalDiamond: 0
      };

      order.enchantments = [];

      const orderForm = createOrderForm(order);
      
      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (resetOrderAE.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (resetOrderAE.js): ${err}`);
    }
  }
};