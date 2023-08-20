const createCustomerReceipt = require('../../utils/createCustomerReceiptAP.js');
const createMerchantTicket = require('../../utils/createMerchantTicketAP.js');
const OrderAP = require('../../schemas/OrderAP.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: {
    name: 'submitOrderAP'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);

    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAP.findOne(query);

      if (!order) {
        console.log('WARNING (submitOrderAP.js): Order does not exist')
        return;
      }

      const { id, status, potions, customer, shopOwner } = order;

      if (potions.length == 0) {
        await interaction.reply({
          content: 'Could not submit: order is empty',
          ephemeral: true
        });
        return;
      }

      order.status = 'SUBMITTED';

      await message.edit({
        content: `Order ${id} has been submitted! Receipt has been sent to your DMs.`,
        components: []
      });

      const cancelOrderButton = new ButtonBuilder()
        .setCustomId('cancelOrderAP')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

      const inProgressButton = new ButtonBuilder()
        .setCustomId('inProgressAP')
        .setLabel('Start Order')
        .setStyle(ButtonStyle.Success);

      var customerObject = await client.users.fetch(customer.id);
      var shopOwnerObject = await client.users.fetch(shopOwner.id);

      order.customerReceipt = (await customerObject.send({
        content: createCustomerReceipt(order),
        components: [new ActionRowBuilder().addComponents(cancelOrderButton)]
      })).id;

      order.merchantTicket = (await shopOwnerObject.send({
        content: createMerchantTicket(order),
        components: [new ActionRowBuilder().addComponents(cancelOrderButton, inProgressButton)]
      })).id;

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (submitOrderAP.js): ${e}`);
      });

    } catch (err) {
      console.log(`ERROR (submitOrderAP.js): ${err}`);
    }
  }
};