const OrderAP = require('../../schemas/OrderAP.js');

module.exports = {
  data: {
    name: 'formSelectAP'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);
    
    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAP.findOne(query);

      if (!order) {
        console.log('WARNING (formSelectAP.js): Order does not exist')
        return;
      }

      order.currentSelections.currentForm = interaction.values[0];

      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (formSelectAP.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (formSelectAP.js): ${err}`);
    }
  }
};