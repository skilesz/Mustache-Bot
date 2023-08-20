const createOrderForm = require('../../utils/createOrderFormAP.js');
const OrderAP = require('../../schemas/OrderAP.js');

module.exports = {
  data: {
    name: 'resetOrderAP'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAP.findOne(query);

      if (!order) {
        console.log('WARNING (resetOrderAP.js): Order does not exist')
        return;
      }

      order.currentSelections = {
        currentName: 'Strength',
        currentForm: 'Bottled',
        currentEnhanced: 'Regular'
      };

      order.totalPrice = {
        totalIron: 0,
        totalGold: 0,
        totalDiamond: 0
      };

      order.potions = [];

      const orderForm = createOrderForm(order);
      
      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (resetOrderAP.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (resetOrderAP.js): ${err}`);
    }
  }
};