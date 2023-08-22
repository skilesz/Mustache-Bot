const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const createOrderString = require('./createOrderStringCBS.js');
const itemsCBS = require('./itemsCBS.js');

module.exports = (order) => {

  const { currentSelections } = order;

    var result = {
    content: `**Welcome to Chip's Building Supply Store!**\n\n` +
      `Please fill out your order below:\n\n` +
      createOrderString(order),
    ephemeral: true,
    components: []
  };

  var categorySelectMenu = new StringSelectMenuBuilder()
    .setCustomId('categorySelectCBS')
    .setMinValues(1)
    .setMaxValues(1);

  var nameSelectMenu = new StringSelectMenuBuilder()
    .setCustomId('nameSelectCBS')
    .setMinValues(1)
    .setMaxValues(1);

  var formSelectMenu = new StringSelectMenuBuilder()
    .setCustomId('formSelectCBS')
    .setMinValues(1)
    .setMaxValues(1);

  for (const item of itemsCBS) {
    const { category } = item;
    
    categorySelectMenu.addOptions(new StringSelectMenuOptionBuilder({
      label: category,
      value: category,
      default: (currentSelections.currentCategory == category)
    }));
  }

  result.components.push(new ActionRowBuilder().addComponents(categorySelectMenu));

  var currentCategory = itemsCBS.find((itemObj) => itemObj.category == currentSelections.currentCategory);
  const { category, items } = currentCategory;
  
  switch (category) {
    case 'Wood':
      for (const item of items) {
        nameSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
          label: item,
          value: item,
          default: (currentSelections.currentName == item)
        }));
      }

      for (const form of currentCategory.forms) {
        formSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
          label: form,
          value: form,
          default: (currentSelections.currentForm == form)
        }));
      }

      result.components.push(new ActionRowBuilder().addComponents(nameSelectMenu));
      result.components.push(new ActionRowBuilder().addComponents(formSelectMenu));
      break;
    case 'Stone':
      for (const item of items) {
        nameSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
          label: item,
          value: item,
          default: (currentSelections.currentName == item)
        }));
      }

      result.components.push(new ActionRowBuilder().addComponents(nameSelectMenu));
      break;
    case 'Materials':
      for (const item of items) {
        const { name } = item;
        
        nameSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
          label: name,
          value: name,
          default: (currentSelections.currentName == name)
        }));
      }

      result.components.push(new ActionRowBuilder().addComponents(nameSelectMenu));
      break;
  }

  const addToOrderButton = new ButtonBuilder()
    .setCustomId('addToOrderCBS')
    .setLabel('Add to Order')
    .setStyle(ButtonStyle.Success);

  const resetOrderButton = new ButtonBuilder()
    .setCustomId('resetOrderCBS')
    .setLabel('Reset')
    .setStyle(ButtonStyle.Secondary);

  const cancelOrderButton = new ButtonBuilder()
    .setCustomId('exitOrderCBS')
    .setLabel('Exit')
    .setStyle(ButtonStyle.Danger);

  const submitOrderButton = new ButtonBuilder()
    .setCustomId('submitOrderCBS')
    .setLabel('Submit')
    .setStyle(ButtonStyle.Success);

  result.components.push(new ActionRowBuilder().addComponents(addToOrderButton));
  result.components.push(new ActionRowBuilder().addComponents(submitOrderButton, resetOrderButton, cancelOrderButton));

  return result;
}