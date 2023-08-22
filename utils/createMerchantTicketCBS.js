const createOrderString = require('./createOrderStringCBS.js');

module.exports = (order) => {
  const { status } = order;
  
  var result = `**---MERCHANT TICKET: CHIP'S BUILDING SUPPLY STORE---**\n\n` +
    `**STATUS: ${status}**\n\n` +
    `**ORDER SUMMARY:**\n\n` +
    createOrderString(order);

  return result;
};