const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const createOrderForm = require('../../utils/createOrderFormAP.js');
const OrderAP = require('../../schemas/OrderAP.js');

module.exports = {
  data: {
    name: 'nameSelectAP'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAP.findOne(query);

      if (!order) {
        console.log('WARNING (nameSelectAP.js): Order does not exist')
        return;
      }

      order.currentSelections.currentName = interaction.values[0];

      const orderForm = createOrderForm(order);

      const nameSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('nameSelectAP')
        .setMinValues(1)
        .setMaxValues(1)
        .setOptions(new StringSelectMenuOptionBuilder({
          label: 'Swiftness',
          value: 'Swiftness',
          default: (interaction.values[0] == 'Swiftness')
        }), new StringSelectMenuOptionBuilder({
          label: 'Slowness',
          value: 'Slowness',
          default: (interaction.values[0] == 'Slowness')
        }), new StringSelectMenuOptionBuilder({
          label: 'Leaping',
          value: 'Leaping',
          default: (interaction.values[0] == 'Leaping')
        }), new StringSelectMenuOptionBuilder({
          label: 'Strength',
          value: 'Strength',
          default: (interaction.values[0] == 'Strength')
        }), new StringSelectMenuOptionBuilder({
          label: 'Healing',
          value: 'Healing',
          default: (interaction.values[0] == 'Healing')
        }), new StringSelectMenuOptionBuilder({
          label: 'Harming',
          value: 'Harming',
          default: (interaction.values[0] == 'Harming')
        }), new StringSelectMenuOptionBuilder({
          label: 'Poison',
          value: 'Poison',
          default: (interaction.values[0] == 'Poison')
        }), new StringSelectMenuOptionBuilder({
          label: 'Regeneration',
          value: 'Regeneration',
          default: (interaction.values[0] == 'Regeneration')
        }), new StringSelectMenuOptionBuilder({
          label: 'Fire Resistance',
          value: 'Fire Resistance',
          default: (interaction.values[0] == 'Fire Resistance')
        }), new StringSelectMenuOptionBuilder({
          label: 'Water Breathing',
          value: 'Water Breathing',
          default: (interaction.values[0] == 'Water Breathing')
        }), new StringSelectMenuOptionBuilder({
          label: 'Night Vision',
          value: 'Night Vision',
          default: (interaction.values[0] == 'Night Vision')
        }), new StringSelectMenuOptionBuilder({
          label: 'Invisibility',
          value: 'Invisibility',
          default: (interaction.values[0] == 'Invisibility')
        }), new StringSelectMenuOptionBuilder({
          label: 'Turtle Master',
          value: 'Turtle Master',
          default: (interaction.values[0] == 'Turtle Master')
        }), new StringSelectMenuOptionBuilder({
          label: 'Slow Falling',
          value: 'Slow Falling',
          default: (interaction.values[0] == 'Slow Falling')
        }), new StringSelectMenuOptionBuilder({
          label: 'Weakness',
          value: 'Weakness',
          default: (interaction.values[0] == 'Weakness')
        }));

      const enhancedSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('enhancedSelectAP')
        .setMinValues(1)
        .setMaxValues(1)
        .setOptions(new StringSelectMenuOptionBuilder({
          label: 'Regular',
          value: 'Regular',
          default: true
        }));

      switch (interaction.values[0]) {
        case 'Swiftness':
        case 'Slowness':
        case 'Leaping':
        case 'Strength':
        case 'Healing':
        case 'Harming':
        case 'Poison':
        case 'Regeneration':
        case 'Turtle Master':
          enhancedSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
            label: 'Enhanced',
            value: 'Enhanced'
          }));
          break;
        default:
          break;
      }

      orderForm.components[0] = new ActionRowBuilder().addComponents(nameSelectMenu);
      orderForm.components[2] = new ActionRowBuilder().addComponents(enhancedSelectMenu);
      
      await message.edit(orderForm);

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (nameSelectAP.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (nameSelectAP.js): ${err}`);
    }
  }
};