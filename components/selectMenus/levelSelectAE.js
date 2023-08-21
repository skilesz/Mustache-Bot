const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const createOrderForm = require('../../utils/createOrderFormAE.js');
const OrderAE = require('../../schemas/OrderAE.js');

module.exports = {
  data: {
    name: 'levelSelectAE'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAE.findOne(query);

      if (!order) {
        console.log('WARNING (levelSelectAE.js): Order does not exist')
        return;
      }

      order.currentSelections.currentLevel = interaction.values[0];

      const orderForm = createOrderForm(order);
      
      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (levelSelectAE.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (levelSelectAE.js): ${err}`);
    }
  }
};