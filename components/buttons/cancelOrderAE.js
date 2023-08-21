const createCustomerReceipt = require('../../utils/createCustomerReceiptAE.js');
const createMerchantTicket = require('../../utils/createMerchantTicketAE.js');
const OrderAE = require('../../schemas/OrderAE.js');

module.exports = {
  data: {
    name: 'cancelOrderAE'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);

    await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAE.findOne(query);

      if (!order) {
        console.log('WARNING (cancelOrderAE.js): Order does not exist');
        return;
      }

      const { id, customer, shopOwner, customerReceipt, merchantTicket } = order;

      var customerObject = await client.users.fetch(customer.id);
      var customerDMChannelObject = customerObject.dmChannel || await customerObject.createDM();
      var customerReceiptObject = await customerDMChannelObject.messages.fetch(customerReceipt);
      var shopOwnerObject = await client.users.fetch(shopOwner.id);
      var shopOwnerDMChannelObject = shopOwnerObject.dmChannel || await shopOwnerObject.createDM();
      var merchantTicketObject = await shopOwnerDMChannelObject.messages.fetch(merchantTicket);

      order.status = 'CANCELLED';

      await customerReceiptObject.edit({
        content: createCustomerReceipt(order),
        components: []
      });

      await customerReceiptObject.reply({
        content: `Order ${id} has been cancelled.`
      });

      await merchantTicketObject.edit({
        content: createMerchantTicket(order),
        components: []
      });

      await merchantTicketObject.reply({
        content: `Order ${id} has been cancelled.`
      });

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (cancelOrderAE.js): ${e}`);
      });

    } catch (err) {
      console.log(`ERROR (cancelOrderAE.js): ${err}`);
    }
  }
};