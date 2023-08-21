const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const createOrderForm = require('../../utils/createOrderFormAE.js');
const OrderAE = require('../../schemas/OrderAE.js');

module.exports = {
  data: {
    name: 'addToOrderAE'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);

    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAE.findOne(query);

      if (!order) {
        console.log('WARNING (addToOrderAE.js): Order does not exist')
        return;
      }

      const { enchantments, currentSelections } = order;

      // Search to see if potion order exists
      const index = enchantments.findIndex((enchantment) => (enchantment.name == currentSelections.currentName &&
                                                   enchantment.level == currentSelections.currentLevel));

      // If potions order exists, edit existing order
      if (index != -1) {
        const { level, amount, pricePerUnit } = order.enchantments[index];
        
        order.enchantments[index].amount += 1;

        order.totalPrice.totalDiamond += pricePerUnit;
        
      } else { // Create new potion order and push to potions array
        var result = {
          name: currentSelections.currentName,
          level: currentSelections.currentLevel,
          amount: 1
        };
        
        switch (currentSelections.currentLevel) {
          case 'V':
            result.pricePerUnit = 25;
            result.currency = 'Diamond';
            break;
          case 'IV':
            result.pricePerUnit = 20;
            result.currency = 'Diamond';
            break;
          case 'III':
            result.pricePerUnit = 15;
            result.currency = 'Diamond';
            break;
          case 'II':
            result.pricePerUnit = 10;
            result.currency = 'Diamond';
            break;
          default:
            result.pricePerUnit = 5;
            result.currency = 'Diamond';
            break;
        }

        order.totalPrice.totalDiamond += result.pricePerUnit;

        order.enchantments.push(result);
      }

      const orderForm = createOrderForm(order);

      await message.edit(orderForm);
      
      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (addToOrderAE.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (addToOrderAE.js): ${err}`);
    }
  }
};