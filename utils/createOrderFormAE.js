const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const createOrderString = require('./createOrderStringAE.js');
const possibleEnchantments = require('./possibleEnchantments.js');

module.exports = (order) => {

  const { currentSelections } = order;

  order.totalPages = Math.ceil(possibleEnchantments.length / 25);

  var nameSelectMenu = new StringSelectMenuBuilder()
    .setCustomId('nameSelectAE')
    .setMinValues(1)
    .setMaxValues(1);

  for (var i = 0 + ((currentSelections.currentPage - 1) * 25); i < (currentSelections.currentPage * 25); i++) {
    if (possibleEnchantments[i]) {
      const { name } = possibleEnchantments[i];

      nameSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
        label: name,
        value: name,
        default: (currentSelections.currentName == name)
      }));
    }
  }

  const currentEnchantment = possibleEnchantments.find((enchantment) => enchantment.name == currentSelections.currentName);

  var levelSelectMenu = new StringSelectMenuBuilder()
    .setCustomId('levelSelectAE')
    .setMinValues(1)
    .setMaxValues(1);

  switch (currentEnchantment.maxLevel) {
    case 5:
      levelSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
        label: 'V',
        value: 'V',
        default: (currentSelections.currentLevel == 'V')
      }));
    case 4:
      levelSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
        label: 'IV',
        value: 'IV',
        default: (currentSelections.currentLevel == 'IV')
      }));
    case 3:
      levelSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
        label: 'III',
        value: 'III',
        default: (currentSelections.currentLevel == 'III')
      }));
    case 2:
      levelSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
        label: 'II',
        value: 'II',
        default: (currentSelections.currentLevel == 'II')
      }));
    default:
      levelSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
        label: 'I',
        value: 'I',
        default: (currentSelections.currentLevel == 'I')
      }));
      break;
  }

  const previousPageButton = new ButtonBuilder()
    .setCustomId('previousPageAE')
    .setLabel('Previous Page')
    .setStyle(ButtonStyle.Secondary);

  const nextPageButton = new ButtonBuilder()
    .setCustomId('nextPageAE')
    .setLabel('Next Page')
    .setStyle(ButtonStyle.Secondary);

  const addToOrderButton = new ButtonBuilder()
    .setCustomId('addToOrderAE')
    .setLabel('Add to Order')
    .setStyle(ButtonStyle.Success);

  const resetOrderButton = new ButtonBuilder()
    .setCustomId('resetOrderAE')
    .setLabel('Reset')
    .setStyle(ButtonStyle.Secondary);

  const cancelOrderButton = new ButtonBuilder()
    .setCustomId('exitOrderAE')
    .setLabel('Exit')
    .setStyle(ButtonStyle.Danger);

  const submitOrderButton = new ButtonBuilder()
    .setCustomId('submitOrderAE')
    .setLabel('Submit')
    .setStyle(ButtonStyle.Success);

  var result = {
    content: `**Welcome to Alpha Enchantments!**\n\n` +
      `Please fill out your order below:\n\n` +
      createOrderString(order),
    ephemeral: true,
    components: [
      new ActionRowBuilder().addComponents(nameSelectMenu),
      new ActionRowBuilder().addComponents(levelSelectMenu)
    ]
  };

  const { totalPages } = order;

  if (currentSelections.currentPage < totalPages && currentSelections.currentPage > 1) {
    result.components.push(new ActionRowBuilder().addComponents(addToOrderButton, previousPageButton, nextPageButton));
  } else if (currentSelections.currentPage == totalPages && currentSelections.currentPage > 1) {
    result.components.push(new ActionRowBuilder().addComponents(addToOrderButton, previousPageButton));
  } else if (currentSelections.currentPage < totalPages && currentSelections.currentPage == 1) {
    result.components.push(new ActionRowBuilder().addComponents(addToOrderButton, nextPageButton));
  } else {
    result.components.push(new ActionRowBuilder().addComponents(addToOrderButton));
  }

  result.components.push(new ActionRowBuilder().addComponents(submitOrderButton, resetOrderButton, cancelOrderButton));

  return result;
}