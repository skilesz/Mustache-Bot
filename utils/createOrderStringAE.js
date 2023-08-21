module.exports = (order) => {
  const { id, customer, shopOwner, enchantments, totalPrice } = order;
  var orderString = '';

  // Add enchantments to order string
  for (const enchantment of enchantments) {
    const { name, level, amount, pricePerUnit, currency } = enchantment;

    orderString += (amount > 0) ? `[+${amount * pricePerUnit} ${currency}]` +
      ` ${name} ${level}: ${amount} book(s)\n` : '';
  }

  orderString += `\n**TOTAL PRICE:** ${totalPrice.totalDiamond} Diamond\n`;

  orderString += `\nCustomer: ${customer.displayName}\n` +
    `Shop Owner: ${shopOwner.displayName}\n` +
    `Order ID: ${id}\n\n`;

  return orderString;
}