module.exports = (order) => {
  const { id, customer, shopOwner, itemOrders, totalPrice } = order;
  var orderString = '';

  // Add enchantments to order string
  for (const item of itemOrders) {
    const { category, name, form, amount, itemsPerUnit, pricePerUnit, currency } = item;

    orderString += `[+${amount * pricePerUnit} ${currency}]` +
      ` ${name}`;
    orderString += (category == 'Wood') ? ` ${form}` : '';
    orderString += `: ${amount * itemsPerUnit}\n`;
  }

  orderString += `\n**TOTAL PRICE:** ${totalPrice.totalIron} Iron, ${totalPrice.totalGold} Gold\n`;

  orderString += `\nCustomer: ${customer.displayName}\n` +
    `Shop Owner: ${shopOwner.displayName}\n` +
    `Order ID: ${id}\n\n`;

  return orderString;
}