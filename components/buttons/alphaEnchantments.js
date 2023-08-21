const { v4: uuidv4 } = require("uuid");
const createOrderForm = require('../../utils/createOrderFormAE.js');
const OrderAE = require('../../schemas/OrderAE.js');

module.exports = {
  data: {
    name: 'alphaEnchantments'
  },
  async execute(client, interaction) {
    // Create new order with schema
    const newOrder = new OrderAE({
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
        currentName: 'Mending',
        currentLevel: 'I',
        currentPage: 1
      },
      enchantments: [],
      totalPrice: {
        totalDiamond: 0
      }
    });

    // Create order form
    const orderForm = createOrderForm(newOrder);

    // Reply with order form
    await interaction.update(orderForm);

    // Save order to database
    await newOrder.save().catch((e) => {
      console.log(`ERROR (alphaEnchantments.js): ${e}`);
    });
  }
};