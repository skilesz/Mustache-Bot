const createCustomerReceipt = require('../../utils/createCustomerReceiptAE.js');
const createMerchantTicket = require('../../utils/createMerchantTicketAE.js');
const OrderAE = require('../../schemas/OrderAE.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: {
    name: 'submitOrderAE'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);

    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAE.findOne(query);

      if (!order) {
        console.log('WARNING (submitOrderAE.js): Order does not exist')
        return;
      }

      const { id, enchantments, customer, shopOwner } = order;

      if (enchantments.length == 0) {
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
        .setCustomId('cancelOrderAE')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

      const inProgressButton = new ButtonBuilder()
        .setCustomId('inProgressAE')
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
        console.log(`ERROR (submitOrderAE.js): ${e}`);
      });

    } catch (err) {
      console.log(`ERROR (submitOrderAE.js): ${err}`);
    }
  }
};