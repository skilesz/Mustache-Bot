const OrderAE = require('../../schemas/OrderAE.js');

module.exports = {
  data: {
    name: 'exitOrderAE'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAE.findOne(query);

      if (!order) {
        console.log('WARNING (exitOrderAE.js): Order does not exist')
        return;
      }

      const { id } = order;

      await message.edit({
        content: `Order ${id} has been cancelled.`,
        components: []
      })

      const result = await OrderAE.deleteOne(query);
      console.log(`Order ${id} deleted`);
      
    } catch (err) {
      console.log(`ERROR (exitOrderAE.js): ${err}`);
    }
  }
};