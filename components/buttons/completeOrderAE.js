const createCustomerReceipt = require('../../utils/createCustomerReceiptAE.js');
const createMerchantTicket = require('../../utils/createMerchantTicketAE.js');
const OrderAE = require('../../schemas/OrderAE.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: {
    name: 'completeOrderAE'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);

    await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAE.findOne(query);

      if (!order) {
        console.log('WARNING (completeOrderAE.js): Order does not exist');
        return;
      }

      const { id, customer, shopOwner, customerReceipt, merchantTicket } = order;

      var customerObject = await client.users.fetch(customer.id);
      var customerDMChannelObject = customerObject.dmChannel || await customerObject.createDM();
      var customerReceiptObject = await customerDMChannelObject.messages.fetch(customerReceipt);
      var shopOwnerObject = await client.users.fetch(shopOwner.id);
      var shopOwnerDMChannelObject = shopOwnerObject.dmChannel || await shopOwnerObject.createDM();
      var merchantTicketObject = await shopOwnerDMChannelObject.messages.fetch(merchantTicket);

      order.status = 'COMPLETED';

      await customerReceiptObject.edit({
        content: createCustomerReceipt(order),
        components: []
      });

      await customerReceiptObject.reply({
        content: `Order ${id} has been completed.`
      });

      await merchantTicketObject.edit({
        content: createMerchantTicket(order),
        components: []
      });

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (completeOrderAE.js): ${e}`);
      });

    } catch (err) {
      console.log(`ERROR (completeOrderAE.js): ${err}`);
    }
  }
};