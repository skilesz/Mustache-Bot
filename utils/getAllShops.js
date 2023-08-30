const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = () => {
  var shops = [];

  const shopFiles = getAllFiles(path.join(__dirname, '..', 'shops'));

  for (const file of shopFiles) {
    const shopObject = require(file);

    shops.push(shopObject);
  }

  return shops;
};