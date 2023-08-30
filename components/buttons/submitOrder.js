const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: {
    name: 'submitOrder'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (submitOrder.js): Shop does not exist`);
      return;
    }
    
    const { shopCode } = shop;

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (submitOrder.js): Order does not exist`);
        return;
      }

      const { id, customer, shopOwner } = order;

      if (!shop.verifySubmit(order)) {
        await interaction.reply({
          content: 'Could not submit: order is empty',
          ephemeral: true
        });
        return;
      }

      order.status = 'SUBMITTED';

      const cancelOrderButton = new ButtonBuilder()
        .setCustomId('cancelOrder')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

      const inProgressButton = new ButtonBuilder()
        .setCustomId('inProgress')
        .setLabel('Start Order')
        .setStyle(ButtonStyle.Primary);

      var customerObject = await client.users.fetch(customer.id);
      var shopChannel = await client.channels.fetch(process.env[shopCode + '_CHANNEL']);

      order.customerReceipt = (await customerObject.send({
        content: shop.createCustomerReceipt(order),
        components: [ new ActionRowBuilder().addComponents(cancelOrderButton) ]
      })).id;

      order.merchantTicket = (await shopChannel.send({
        content: shop.createMerchantTicket(order),
        components: [ new ActionRowBuilder().addComponents(cancelOrderButton, inProgressButton) ]
      })).id;

      await interaction.update({
        content: `Order ${id} has been submitted! Receipt has been sent to your DMs.`,
        components: []
      });

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (submitOrder.js: save()): ${e}`);
      });

    } catch (err) {
      console.log(`ERROR (submitOrder.js): ${err}`);
    }
  }
};