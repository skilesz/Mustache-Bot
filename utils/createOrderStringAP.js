module.exports = (order) => {
  const { id, customer, shopOwner, potions, totalPrice } = order;
  var orderString = '';
  
  // Add potions to order string
  for (const potion of potions) {
    const { name, form, amount, enhanced, pricePerUnit, currency } = potion;
    
    orderString += (amount > 0) ? `[+${amount * pricePerUnit} ${currency}]` +
      ` ${name} (${form}): ${amount * 3} potions` : '';;
    orderString += (enhanced > 0 && enhanced <= amount) ? `\t[+${enhanced * 20} Iron]` +
      ` (${enhanced * 3} enhanced)\n` : '\n';
  }

  orderString += `\n**TOTAL PRICE:** ${totalPrice.totalIron} Iron, ${totalPrice.totalGold} Gold, ${totalPrice.totalDiamond} Diamond\n`;

  orderString += `\nCustomer: ${customer.displayName}\n` +
    `Shop Owner: ${shopOwner.displayName}\n` +
    `Order ID: ${id}\n\n`;

  return orderString;
}