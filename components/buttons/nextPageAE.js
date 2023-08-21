const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const createOrderForm = require('../../utils/createOrderFormAE.js');
const OrderAE = require('../../schemas/OrderAE.js');
const possibleEnchantments = require('../../utils/possibleEnchantments.js');

module.exports = {
  data: {
    name: 'nextPageAE'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAE.findOne(query);

      if (!order) {
        console.log('WARNING (nextPageAE.js): Order does not exist')
        return;
      }

      order.currentSelections.currentPage += 1;
      order.currentSelections.currentName = possibleEnchantments[(25 * (order.currentSelections.currentPage - 1))].name;
      order.currentSelections.currentLevel = 'I';

      const orderForm = createOrderForm(order);
      
      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (nextPageAE.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (nextPageAE.js): ${err}`);
    }
  }
};