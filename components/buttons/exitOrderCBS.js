const OrderCBS = require('../../schemas/OrderCBS.js');

module.exports = {
  data: {
    name: 'exitOrderCBS'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderCBS.findOne(query);

      if (!order) {
        console.log('WARNING (exitOrderCBS.js): Order does not exist')
        return;
      }

      const { id } = order;

      await message.edit({
        content: `Order ${id} has been cancelled.`,
        components: []
      })

      const result = await OrderCBS.deleteOne(query);
      console.log(`Order ${id} deleted`);
      
    } catch (err) {
      console.log(`ERROR (exitOrderCBS.js): ${err}`);
    }
  }
};