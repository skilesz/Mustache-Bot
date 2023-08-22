const { v4: uuidv4 } = require("uuid");
const createOrderForm = require('../../utils/createOrderFormCBS.js');
const OrderCBS = require('../../schemas/OrderCBS.js');

module.exports = {
  data: {
    name: 'chipsBuildingSupply'
  },
  async execute(client, interaction) {
    // Create new order with schema
    const newOrder = new OrderCBS({
      id: uuidv4(),
      status: 'ORDERING',
      customer: {
        displayName: interaction.member.displayName,
        id: interaction.member.id
      },
      shopOwner: {
        displayName: 'Lupey3',
        id: '217000198977617921'
      },
      currentSelections: {
        currentCategory: 'Wood',
        currentName: 'Oak',
        currentForm: 'Logs',
        currentPage: 1
      },
      itemOrders: [],
      totalPrice: {
        totalIron: 0,
        totalGold: 0
      }
    });

    // Create order form
    const orderForm = createOrderForm(newOrder);

    // Reply with order form
    await interaction.update(orderForm);

    // Save order to database
    await newOrder.save().catch((e) => {
      console.log(`ERROR (chipsBuildingSupply.js): ${e}`);
    });
  }
};