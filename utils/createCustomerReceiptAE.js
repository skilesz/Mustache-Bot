const createOrderString = require('./createOrderStringAE.js');

module.exports = (order) => {
  const { status } = order;

  var result = `**---CUSTOMER RECEIPT: ALPHA ENCHANTMENTS---**\n\n` +
    `**STATUS: ${status}**\n\n` +
    `**ORDER SUMMARY:**\n\n` +
    createOrderString(order);

  return result;
};