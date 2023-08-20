const OrderAP = require('../../schemas/OrderAP.js');

module.exports = {
  data: {
    name: 'exitOrderAP'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAP.findOne(query);

      if (!order) {
        console.log('WARNING (exitOrderAP.js): Order does not exist')
        return;
      }

      const { id } = order;

      await message.edit({
        content: `Order ${id} has been cancelled.`,
        components: []
      })

      const result = await OrderAP.deleteOne(query);
      console.log(`Order ${id} deleted`);
      
    } catch (err) {
      console.log(`ERROR (exitOrderAP.js): ${err}`);
    }
  }
};