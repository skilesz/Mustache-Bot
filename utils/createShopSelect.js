const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const getAllShops = require('./getAllShops.js');

module.exports = (currentShopName) => {
  const shops = getAllShops();
  
  var shopSelectMenu = new StringSelectMenuBuilder()
    .setCustomId('shopSelect')
    .setMinValues(1)
    .setMaxValues(1);

  for (const shop of shops) {
    const { shopName } = shop;

    shopSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
      label: shopName,
      value: shopName,
      default: (shopName == currentShopName)
    }));
  }

  const createOrderButton = new ButtonBuilder()
    .setCustomId('createOrder')
    .setLabel('Create Order')
    .setStyle(ButtonStyle.Primary);

  return {
    content: '**Welcome to Mustache Marketplace!**\n\n' +
      'Please choose a shop:\n\n' +
      `Shop Name: ${currentShopName}`,
    components: [
      new ActionRowBuilder().addComponents(shopSelectMenu),
      new ActionRowBuilder().addComponents(createOrderButton)
    ],
    ephemeral: true
  };
}