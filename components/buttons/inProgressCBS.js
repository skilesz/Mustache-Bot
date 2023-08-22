const createCustomerReceipt = require('../../utils/createCustomerReceiptCBS.js');
const createMerchantTicket = require('../../utils/createMerchantTicketCBS.js');
const OrderCBS = require('../../schemas/OrderCBS.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: {
    name: 'inProgressCBS'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);

    await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderCBS.findOne(query);

      if (!order) {
        console.log('WARNING (inProgressCBS.js): Order does not exist');
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
        .setCustomId('cancelOrderCBS')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

      const readyButton = new ButtonBuilder()
        .setCustomId('readyCBS')
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
        console.log(`ERROR (inProgressCBS.js): ${e}`);
      });

    } catch (err) {
      console.log(`ERROR (inProgressCBS.js): ${err}`);
    }
  }
};