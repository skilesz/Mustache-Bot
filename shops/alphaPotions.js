const { v4: uuidv4 } = require("uuid");
const Order = require('../schemas/OrderAP.js');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  // SHOP NAME
  shopName: 'Alpha Potions',

  // SHOP CODE
  shopCode: 'AP',


  
  // MENU
  menu: [
    {
      name: 'Swiftness',
      enhanceable: true,
      pricePerUnit: 10,
      currency: 'Iron'
    },
    {
      name: 'Slowness',
      enhanceable: true,
      pricePerUnit: 30,
      currency: 'Iron'
    },
    {
      name: 'Leaping',
      enhanceable: true,
      pricePerUnit: 5,
      currency: 'Diamond'
    },
    {
      name: 'Strength',
      enhanceable: true,
      pricePerUnit: 2,
      currency: 'Diamond'
    },
    {
      name: 'Healing',
      enhanceable: true,
      pricePerUnit: 5,
      currency: 'Gold'
    },
    {
      name: 'Harming',
      enhanceable: true,
      pricePerUnit: 30,
      currency: 'Iron'
    },
    {
      name: 'Poison',
      enhanceable: true,
      pricePerUnit: 10,
      currency: 'Iron'
    },
    {
      name: 'Regeneration',
      enhanceable: true,
      pricePerUnit: 3,
      currency: 'Diamond'
    },
    {
      name: 'Fire Resistance',
      enhanceable: false,
      pricePerUnit: 4,
      currency: 'Diamond'
    },
    {
      name: 'Water Breathing',
      enhanceable: false,
      pricePerUnit: 15,
      currency: 'Iron'
    },
    {
      name: 'Night Vision',
      enhanceable: false,
      pricePerUnit: 5,
      currency: 'Gold'
    },
    {
      name: 'Invisibility',
      enhanceable: false,
      pricePerUnit: 8,
      currency: 'Gold'
    },
    {
      name: 'Turtle Master',
      enhanceable: true,
      pricePerUnit: 5,
      currency: 'Diamond'
    },
    {
      name: 'Slow Falling',
      enhanceable: false,
      pricePerUnit: 3,
      currency: 'Diamond'
    },
    {
      name: 'Weakness',
      enhanceable: true,
      pricePerUnit: 20,
      currency: 'Iron'
    },
  ],


  
  // CREATE ORDER
  createOrder: function (client, interaction) {
    const newOrder = new Order({
      id: uuidv4(),
      status: 'ORDERING',
      shopName: 'Alpha Potions',
      customer: {
        displayName: interaction.member.displayName,
        id: interaction.member.id
      },
      shopOwner: {
        displayName: 'bigsaltyball',
        id: process.env['BIGSALTYBALL_ID']
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

    return newOrder;
  },


  
  // CREATE ORDER FORM
  createOrderForm: function (order) {
    const { currentSelections } = order;
    const totalPages = Math.ceil(this.menu.length / 25);
    
    const nameSelectMenu = new StringSelectMenuBuilder()
    .setCustomId('nameSelect')
    .setMinValues(1)
    .setMaxValues(1);

    for (const item of this.menu) {
      const { name } = item;

      nameSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
        label: name,
        value: name,
        default: (currentSelections.currentName == name)
      }));
    }

    const formSelectMenu = new StringSelectMenuBuilder()
      .setCustomId('formSelect')
      .setMinValues(1)
      .setMaxValues(1)
      .setOptions(new StringSelectMenuOptionBuilder({
        label: 'Bottled',
        value: 'Bottled',
        default: (currentSelections.currentForm == 'Bottled')
      }), new StringSelectMenuOptionBuilder({
        label: 'Splash',
        value: 'Splash',
        default: (currentSelections.currentForm == 'Splash')
      }), new StringSelectMenuOptionBuilder({
        label: 'Lingering',
        value: 'Lingering',
        default: (currentSelections.currentForm == 'Lingering')
      }));

    const enhancedSelectMenu = new StringSelectMenuBuilder()
      .setCustomId('enhancedSelect')
      .setMinValues(1)
      .setMaxValues(1)
      .setOptions(new StringSelectMenuOptionBuilder({
        label: 'Regular',
        value: 'Regular',
        default: (currentSelections.currentEnhanced == 'Regular')
      }));
  
    const currentItem = this.menu.find((item) => currentSelections.currentName == item.name);
      
    if (currentItem.enhanceable) {
      enhancedSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
        label: 'Enhanced',
        value: 'Enhanced',
        default: (currentSelections.currentEnhanced == 'Enhanced')
      }))
    }
  
    const addToOrderButton = new ButtonBuilder()
        .setCustomId('addToOrder')
        .setLabel('Add to Order')
        .setStyle(ButtonStyle.Primary);
  
    const resetOrderButton = new ButtonBuilder()
        .setCustomId('resetOrder')
        .setLabel('Reset')
        .setStyle(ButtonStyle.Secondary);
  
    const cancelOrderButton = new ButtonBuilder()
        .setCustomId('exitOrder')
        .setLabel('Exit')
        .setStyle(ButtonStyle.Danger);
  
    const submitOrderButton = new ButtonBuilder()
        .setCustomId('submitOrder')
        .setLabel('Submit')
        .setStyle(ButtonStyle.Success);
  
    var result = {
      content: `**Welcome to Alpha Potions!**\n\n` +
          `Please fill out your order below:\n\n` +
          this.createOrderString(order),
      ephemeral: true,
      components: [ 
        new ActionRowBuilder().addComponents(nameSelectMenu),
        new ActionRowBuilder().addComponents(formSelectMenu),
        new ActionRowBuilder().addComponents(enhancedSelectMenu),
        new ActionRowBuilder().addComponents(addToOrderButton),
        new ActionRowBuilder().addComponents(submitOrderButton, resetOrderButton, cancelOrderButton) 
      ]
    };
  
    return result;
  },



  // CREATE ORDER STRING
  createOrderString: function (order) {
    const { id, shopName, customer, shopOwner, potions, totalPrice } = order;
    var orderString = '';
  
    for (const potion of potions) {
      const { name, form, amount, enhanced, pricePerUnit, currency } = potion;
      
      orderString += `[+${amount * pricePerUnit} ${currency}]` +
        ` ${name} (${form}): ${amount * 3} potions`;
      orderString += (enhanced > 0) ? `\t[+${enhanced * 20} Iron]` +
        ` (${enhanced * 3} enhanced)\n` : '\n';
    }
  
    orderString += `\n**TOTAL PRICE:** ${totalPrice.totalIron} Iron, ${totalPrice.totalGold} Gold, ${totalPrice.totalDiamond} Diamond\n`;
  
    orderString += `\nCustomer: ${customer.displayName}\n` +
      `Shop Owner: ${shopOwner.displayName}\n` +
      `Order ID: ${id}\n` +
      `Shop Name: ${shopName}`;
  
    return orderString;
  },



  // SELECT NAME
  selectName: function (order, value) {
    order.currentSelections.currentName = value;
    order.currentSelections.currentEnhanced = 'Regular';

    return order; 
  },



  // RESET ORDER
  resetOrder: function (order) {
    order.currentSelections = {
      currentName: 'Strength',
      currentForm: 'Bottled',
      currentEnhanced: 'Regular'
    };

    order.totalPrice = {
      totalIron: 0,
      totalGold: 0,
      totalDiamond: 0
    };

    order.potions = [];

    return order;
  },



  // ADD TO ORDER
  addToOrder: function (order) {
    const { potions, currentSelections } = order;

    // Search to see if potion order exists
    const index = potions.findIndex((potion) => (potion.name == currentSelections.currentName &&
                                                 potion.form == currentSelections.currentForm));

    // If potions order exists, edit existing order
    if (index != -1) {
      const { amount, enhanced, pricePerUnit, currency } = potions[index];
      
      order.potions[index].amount += 1;

      if (currentSelections.currentEnhanced == 'Enhanced') {
        order.potions[index].enhanced += 1;
        order.totalPrice.totalIron += 20;
      }

      switch (currency) {
        case 'Iron':
          order.totalPrice.totalIron += pricePerUnit;
          break;
        case 'Gold':
          order.totalPrice.totalGold += pricePerUnit;
          break;
        case 'Diamond':
          order.totalPrice.totalDiamond += pricePerUnit;
          break;
      }
    } else { // Create new potion order and push to potions array
      var result = {
        name: currentSelections.currentName,
        form: currentSelections.currentForm,
        amount: 1,
        enhanced: (currentSelections.currentEnhanced == 'Enhanced') ? 1 : 0
      };

      const currentPotion = this.menu.find((item) => item.name == currentSelections.currentName);

      const { pricePerUnit, currency } = currentPotion;

      switch (currency) {
        case 'Iron':
          result.pricePerUnit = (currentSelections.currentForm == 'Lingering') ? pricePerUnit * 3 : pricePerUnit;
          order.totalPrice.totalIron += result.pricePerUnit;
          break;
        case 'Gold':
          result.pricePerUnit = (currentSelections.currentForm == 'Lingering') ? pricePerUnit * 5 : pricePerUnit;
          order.totalPrice.totalGold += result.pricePerUnit;
          break;
        case 'Diamond':
          result.pricePerUnit = (currentSelections.currentForm == 'Lingering') ? pricePerUnit * 2 : pricePerUnit;
          order.totalPrice.totalDiamond += result.pricePerUnit;
          break;
      }

      if (currentSelections.currentEnhanced == 'Enhanced') {
        order.totalPrice.totalIron += 20;
      }

      result.currency = currency;

      order.potions.push(result);
    }

    return order;
  },



  // VERIFY SUBMIT
  verifySubmit: function (order) {
    const { potions } = order;
  
    return (potions.length > 0);
  },



  // CREATE CUSTOMER RECEIPT
  createCustomerReceipt: function (order) {
    const { status } = order;
  
    var result = `**---CUSTOMER RECEIPT: ALPHA POTIONS---**\n\n` +
      `**STATUS: ${status}**\n\n` +
      `**ORDER SUMMARY:**\n\n` +
      this.createOrderString(order);
  
    return result;
  },



  // CREATE MERCHANT TICKET
  createMerchantTicket: function (order) {
    const { status } = order;
  
    var result = `**---MERCHANT TICKET: ALPHA POTIONS---**\n\n` +
      `**STATUS: ${status}**\n\n` +
      `**ORDER SUMMARY:**\n\n` +
      this.createOrderString(order);
  
    return result;
  }
};