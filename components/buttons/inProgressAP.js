const createCustomerReceipt = require('../../utils/createCustomerReceiptAP.js');
const createMerchantTicket = require('../../utils/createMerchantTicketAP.js');
const OrderAP = require('../../schemas/OrderAP.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: {
    name: 'inProgressAP'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);

    await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAP.findOne(query);

      if (!order) {
        console.log('WARNING (inProgressAP.js): Order does not exist');
        return;
      }

      const { id, customer, shopOwner, customerReceipt, merchantTicket } = order;

      var customerObject = await client.users.fetch(customer.id);
      var customerDMChannelObject = customerObject.dmChannel || await customerObject.createDM();
      var customerReceiptObject = await customerDMChannelObject.messages.fetch(customerReceipt);
      var shopOwnerObject = await client.users.fetch(shopOwner.id);
      var shopOwnerDMChannelObject = shopOwnerObject.dmChannel || await shopOwnerObject.createDM();
      var merchantTicketObject = await shopOwnerDMChannelObject.messages.fetch(merchantTicket);

      order.status = 'IN PROGRESS';

      const cancelOrderButton = new ButtonBuilder()
        .setCustomId('cancelOrderAP')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

      const readyButton = new ButtonBuilder()
        .setCustomId('readyAP')
        .setLabel('Order Ready for Pickup/Delivery')
        .setStyle(ButtonStyle.Success);

      await customerReceiptObject.edit({
        content: createCustomerReceipt(order),
        components: [new ActionRowBuilder().addComponents(cancelOrderButton)]
      });

      await customerReceiptObject.reply({
        content: `Order ${id} has been started.`
      });

      await merchantTicketObject.edit({
        content: createMerchantTicket(order),
        components: [new ActionRowBuilder().addComponents(cancelOrderButton, readyButton)]
      });

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (inProgressAP.js): ${e}`);
      });

    } catch (err) {
      console.log(`ERROR (inProgressAP.js): ${err}`);
    }
  }
};