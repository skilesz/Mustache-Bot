const findShop = require('../../utils/findShop.js');
const findOrder = require('../../utils/findOrder.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: {
    name: 'inProgress'
  },
  async execute(client, interaction) {
    const shop = findShop(interaction);

    if (!shop) {
      console.log(`WARNING (inProgress.js): Shop does not exist`);
      return;
    }

    const { shopCode } = shop;
    var message = await interaction.deferUpdate();

    try {
      var order = await findOrder(interaction, shopCode);

      if (!order) {
        console.log(`WARNING (inProgress.js): Order does not exist`);
        return;
      }

      const { id, customer, shopOwner, customerReceipt, merchantTicket } = order;

      var customerObject = await client.users.fetch(customer.id);
      var customerDMChannelObject = customerObject.dmChannel || await customerObject.createDM();
      var customerReceiptObject = await customerDMChannelObject.messages.fetch(customerReceipt);
      var shopChannelObject = await client.channels.fetch(process.env[shopCode + '_CHANNEL']);
      var merchantTicketObject = await shopChannelObject.messages.fetch(merchantTicket);

      order.status = 'IN PROGRESS';

      const cancelOrderButton = new ButtonBuilder()
        .setCustomId('cancelOrder')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

      const readyButton = new ButtonBuilder()
        .setCustomId('ready')
        .setLabel('Order Ready for Pickup/Delivery')
        .setStyle(ButtonStyle.Primary);

      await customerReceiptObject.edit({
        content: shop.createCustomerReceipt(order),
        components: [ new ActionRowBuilder().addComponents(cancelOrderButton) ]
      });

      await customerReceiptObject.reply({
        content: `Order ${id} has been started.`
      });

      await merchantTicketObject.edit({
        content: shop.createMerchantTicket(order),
        components: [ new ActionRowBuilder().addComponents(cancelOrderButton, readyButton) ]
      });

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (inProgress.js: save()): ${e}`);
      });

    } catch (err) {
      console.log(`ERROR (inProgress.js): ${err}`);
    }
  }
};