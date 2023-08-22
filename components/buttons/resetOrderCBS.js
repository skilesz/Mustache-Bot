const createOrderForm = require('../../utils/createOrderFormCBS.js');
const OrderCBS = require('../../schemas/OrderCBS.js');

module.exports = {
  data: {
    name: 'resetOrderCBS'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderCBS.findOne(query);

      if (!order) {
        console.log('WARNING (resetOrderCBS.js): Order does not exist')
        return;
      }

      order.currentSelections = {
        currentCategory: 'Wood',
        currentName: 'Oak',
        currentForm: 'Planks'
      };

      order.totalPrice = {
        totalIron: 0,
        totalGold: 0
      };

      order.itemOrders = [];

      const orderForm = createOrderForm(order);
      
      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (resetOrderCBS.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (resetOrderCBS.js): ${err}`);
    }
  }
};