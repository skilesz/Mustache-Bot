module.exports = async (interaction, shopCode) => {
  const lines = interaction.message.content.split('\n');
  const orderID = lines[lines.length - 2].substring(10);
  const query = { id: orderID };
  const Order = require(`../schemas/Order${shopCode}.js`);
  var order = await Order.findOne(query);

  if (!order) {
    console.log(`WARNING (findOrder.js: shopCode = ${shopCode}): Order does not exist`)
    return;
  }

  return order;
}