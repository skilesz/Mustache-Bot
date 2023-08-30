module.exports = async (id, shopCode) => {
  const query = { id };
  const Order = require(`../schemas/Order${shopCode}.js`);
  await Order.deleteOne(query);

  console.log(`Order ${id} deleted`);
}