const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const createOrderForm = require('../../utils/createOrderFormCBS.js');
const OrderCBS = require('../../schemas/OrderCBS.js');
const itemsCBS = require('../../utils/itemsCBS.js');

module.exports = {
  data: {
    name: 'categorySelectCBS'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderCBS.findOne(query);

      if (!order) {
        console.log('WARNING (categorySelectCBS.js): Order does not exist')
        return;
      }

      var selectedCategory = interaction.values[0];
      order.currentSelections.currentCategory = selectedCategory;
      var itemList = itemsCBS.find((itemObj) => itemObj.category == selectedCategory)

      switch (selectedCategory) {
        case 'Wood':
          order.currentSelections.currentName = itemList.items[0];
          order.currentSelections.currentForm = itemList.forms[0];
          break;
        case 'Stone':
          order.currentSelections.currentName = itemList.items[0];
          break;
        case 'Materials':
          order.currentSelections.currentName = itemList.items[0].name;
          break;
      }

      const orderForm = createOrderForm(order);
      
      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (categorySelectCBS.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (categorySelectCBS.js): ${err}`);
    }
  }
};