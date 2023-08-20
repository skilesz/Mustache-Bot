const createOrderString = require('./createOrderStringAP.js');

module.exports = (order) => {
  const { status } = order;
  
  var result = `**---MERCHANT TICKET: ALPHA POTIONS---**\n\n` +
    `**STATUS: ${status}**\n\n` +
    `**ORDER SUMMARY:**\n\n` +
    createOrderString(order);

  return result;
};