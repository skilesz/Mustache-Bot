const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const createOrderForm = require('../../utils/createOrderFormCBS.js');
const OrderCBS = require('../../schemas/OrderCBS.js');
const itemsCBS = require('../../utils/itemsCBS.js');

module.exports = {
  data: {
    name: 'addToOrderCBS'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);

    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderCBS.findOne(query);

      if (!order) {
        console.log('WARNING (addToOrderCBS.js): Order does not exist')
        return;
      }

      const { itemOrders, currentSelections } = order;

      // Search to see if item order exists
      const index = itemOrders.findIndex((itemObj) => {
        var condition = (itemObj.name == currentSelections.currentName);

        if (currentSelections.currentCategory == 'Wood') {
          condition = condition && (itemObj.form == currentSelections.currentForm);
        }

        return condition;
      });

      // If potions order exists, edit existing order
      if (index != -1) {
        const { amount, pricePerUnit, currency } = order.itemOrders[index];

        order.itemOrders[index].amount += 1;

        switch (currency) {
          case 'Iron':
            order.totalPrice.totalIron += pricePerUnit;
            break;
          case 'Gold':
            order.totalPrice.totalGold += pricePerUnit;
            break;
        }

      } else { // Create new potion order and push to potions array
        var result = {
          category: currentSelections.currentCategory,
          name: currentSelections.currentName,
          amount: 1
        };

        if (currentSelections.currentCategory == 'Wood') {
          result.form = currentSelections.currentForm;
        }

        const currentCategory = itemsCBS.find((itemObj) => itemObj.category == currentSelections.currentCategory);

        switch (currentSelections.currentCategory) {
          case 'Wood':
          case 'Stone':
            result.pricePerUnit = currentCategory.pricePerUnit;
            result.currency = currentCategory.currency;
            result.itemsPerUnit = currentCategory.itemsPerUnit;
            break;
          case 'Materials':
            const currentItem = currentCategory.items.find((item) => item.name == currentSelections.currentName);

            result.pricePerUnit = currentItem.pricePerUnit;
            result.currency = currentItem.currency;
            result.itemsPerUnit = currentItem.itemsPerUnit;
            break;
        }

        switch (result.currency) {
          case 'Iron':
            order.totalPrice.totalIron += result.pricePerUnit;
            break;
          case 'Gold':
            order.totalPrice.totalGold += result.pricePerUnit;
            break;
        }

        order.itemOrders.push(result);
      }

      const orderForm = createOrderForm(order);

      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (addToOrderCBS.js): ${e}`);
      });

    } catch (err) {
      console.log(`ERROR (addToOrderCBS.js): ${err}`);
    }
  }
};