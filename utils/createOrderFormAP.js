const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const createOrderString = require('./createOrderStringAP.js');

module.exports = (order) => {
  
  const nameSelectMenu = new StringSelectMenuBuilder()
    .setCustomId('nameSelectAP')
    .setMinValues(1)
    .setMaxValues(1)
    .setOptions(new StringSelectMenuOptionBuilder({
      label: 'Swiftness',
      value: 'Swiftness'
    }), new StringSelectMenuOptionBuilder({
      label: 'Slowness',
      value: 'Slowness'
    }), new StringSelectMenuOptionBuilder({
      label: 'Leaping',
      value: 'Leaping'
    }), new StringSelectMenuOptionBuilder({
      label: 'Strength',
      value: 'Strength',
      default: true
    }), new StringSelectMenuOptionBuilder({
      label: 'Healing',
      value: 'Healing'
    }), new StringSelectMenuOptionBuilder({
      label: 'Harming',
      value: 'Harming'
    }), new StringSelectMenuOptionBuilder({
      label: 'Poison',
      value: 'Poison'
    }), new StringSelectMenuOptionBuilder({
      label: 'Regeneration',
      value: 'Regeneration'
    }), new StringSelectMenuOptionBuilder({
      label: 'Fire Resistance',
      value: 'Fire Resistance'
    }), new StringSelectMenuOptionBuilder({
      label: 'Water Breathing',
      value: 'Water Breathing'
    }), new StringSelectMenuOptionBuilder({
      label: 'Night Vision',
      value: 'Night Vision'
    }), new StringSelectMenuOptionBuilder({
      label: 'Invisibility',
      value: 'Invisibility'
    }), new StringSelectMenuOptionBuilder({
      label: 'Turtle Master',
      value: 'Turtle Master'
    }), new StringSelectMenuOptionBuilder({
      label: 'Slow Falling',
      value: 'Slow Falling'
    }), new StringSelectMenuOptionBuilder({
      label: 'Weakness',
      value: 'Weakness'
    }));

  const formSelectMenu = new StringSelectMenuBuilder()
    .setCustomId('formSelectAP')
    .setMinValues(1)
    .setMaxValues(1)
    .setOptions(new StringSelectMenuOptionBuilder({
      label: 'Bottled',
      value: 'Bottled',
      default: true
    }), new StringSelectMenuOptionBuilder({
      label: 'Splash',
      value: 'Splash'
    }), new StringSelectMenuOptionBuilder({
      label: 'Lingering',
      value: 'Lingering'
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

  const addToOrderButton = new ButtonBuilder()
      .setCustomId('addToOrderAP')
      .setLabel('Add to Order')
      .setStyle(ButtonStyle.Success);

  const resetOrderButton = new ButtonBuilder()
      .setCustomId('resetOrderAP')
      .setLabel('Reset')
      .setStyle(ButtonStyle.Secondary);

  const cancelOrderButton = new ButtonBuilder()
      .setCustomId('exitOrderAP')
      .setLabel('Exit')
      .setStyle(ButtonStyle.Danger);

  const submitOrderButton = new ButtonBuilder()
      .setCustomId('submitOrderAP')
      .setLabel('Submit')
      .setStyle(ButtonStyle.Success);

  var result = {
    content: `**Welcome to Alpha Potions!**\n\n` +
        `Please fill out your order below:\n\n` +
        createOrderString(order),
    ephemeral: true,
    components: [ 
      new ActionRowBuilder().addComponents(nameSelectMenu),
      new ActionRowBuilder().addComponents(formSelectMenu),
      new ActionRowBuilder().addComponents(enhancedSelectMenu),
      new ActionRowBuilder().addComponents(addToOrderButton),
      new ActionRowBuilder().addComponents(submitOrderButton, resetOrderButton, cancelOrderButton) 
    ]
  };

  return result;
}