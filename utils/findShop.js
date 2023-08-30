const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (interaction) => {
  const lines = interaction.message.content.split('\n');
  const shopName = lines[lines.length - 1].substring(11);
  const shopFiles = getAllFiles(path.join(__dirname, '..', 'shops'));
  var shops = [];

  for (const file of shopFiles) {
    const shopObject = require(file);

    shops.push(shopObject);
  }

  return shops.find((shop) => shopName == shop.shopName);
};