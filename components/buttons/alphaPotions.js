const { v4: uuidv4 } = require("uuid");
const createOrderForm = require('../../utils/createOrderFormAP.js');
const OrderAP = require('../../schemas/OrderAP.js');

module.exports = {
  data: {
    name: 'alphaPotions'
  },
  async execute(client, interaction) {
    // Create new order with schema
    const newOrder = new OrderAP({
      id: uuidv4(),
      status: 'ORDERING',
      customer: {
        displayName: interaction.member.displayName,
        id: interaction.member.id
      },
      shopOwner: {
        displayName: 'bigsaltyball',
        id: '210628118682140674'
      },
      currentSelections: {
        currentName: 'Strength',
        currentForm: 'Bottled',
        currentEnhanced: 'Regular'
      },
      potions: [],
      totalPrice: {
        totalIron: 0,
        totalGold: 0,
        totalDiamond: 0
      }
    });

    // Create order form
    const orderForm = createOrderForm(newOrder);

    // Reply with order form
    await interaction.update(orderForm);

    // Save order to database
    await newOrder.save().catch((e) => {
      console.log(`ERROR (alphaPotions.js): ${e}`);
    });
  }
};