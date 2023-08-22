const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const createOrderForm = require('../../utils/createOrderFormCBS.js');
const OrderCBS = require('../../schemas/OrderCBS.js');

module.exports = {
  data: {
    name: 'nameSelectCBS'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderCBS.findOne(query);

      if (!order) {
        console.log('WARNING (nameSelectCBS.js): Order does not exist')
        return;
      }

      order.currentSelections.currentName = interaction.values[0];

      const orderForm = createOrderForm(order);
      
      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (nameSelectCBS.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (nameSelectCBS.js): ${err}`);
    }
  }
};