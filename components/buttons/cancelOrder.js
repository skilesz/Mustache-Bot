const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');

module.exports = {
  data: {
    name: 'cancelOrder'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (cancelOrder.js): Shop does not exist`);
      return;
    }

    const { shopCode } = shop;
    var message = await interaction.deferUpdate();

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (cancelOrder.js): Order does not exist`);
        return;
      }

      const { id, customer, shopOwner, customerReceipt, merchantTicket } = order;

      var customerObject = await client.users.fetch(customer.id);
      var customerDMChannelObject = customerObject.dmChannel || await customerObject.createDM();
      var customerReceiptObject = await customerDMChannelObject.messages.fetch(customerReceipt);
      var shopChannelObject = await client.channels.fetch(process.env[shopCode + '_CHANNEL']);
      var merchantTicketObject = await shopChannelObject.messages.fetch(merchantTicket);

      order.status = 'CANCELLED';

      await customerReceiptObject.edit({
        content: shop.createCustomerReceipt(order),
        components: []
      });

      await customerReceiptObject.reply({
        content: `Order ${id} has been cancelled.`
      });

      await merchantTicketObject.edit({
        content: shop.createMerchantTicket(order),
        components: []
      });

      await merchantTicketObject.reply({
        content: `Order ${id} has been cancelled.`
      });

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (cancelOrder.js: save()): ${e}`);
      });

    } catch (err) {
      console.log(`ERROR (cancelOrder.js): ${err}`);
    }
  }
};