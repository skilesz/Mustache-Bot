const OrderAP = require('../../schemas/OrderAP.js');

module.exports = {
  data: {
    name: 'enhancedSelectAP'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAP.findOne(query);

      if (!order) {
        console.log('WARNING (enhancedSelectAP.js): Order does not exist')
        return;
      }

      order.currentSelections.currentEnhanced = interaction.values[0];

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (enhancedSelectAP.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (enhancedSelectAP.js): ${err}`);
    }
  }
};