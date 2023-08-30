const { v4: uuidv4 } = require("uuid");
const Order = require('../schemas/OrderAFS.js');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  // SHOP NAME
  shopName: 'Alpha Food and Supplies',

  // SHOP CODE
  shopCode: 'AFS',


  
  // MENU
  menu: [
    {
      name: 'Steak',
      pricePerUnit: 10,
      currency: 'Iron',
      taxed: true
    },
    {
      name: 'Chicken',
      pricePerUnit: 5,
      currency: 'Iron',
      taxed: true
    },
    {
      name: 'Pork',
      pricePerUnit: 8,
      currency: 'Iron',
      taxed: true
    },
    {
      name: 'Wheat',
      pricePerUnit: 5,
      currency: 'Iron',
      taxed: false
    },
    {
      name: 'Potatoes',
      pricePerUnit: 10,
      currency: 'Iron',
      taxed: true
    },
    {
      name: 'Sugar',
      pricePerUnit: 5,
      currency: 'Iron',
      taxed: false
    },
    {
      name: 'Sugar Cane',
      pricePerUnit: 5,
      currency: 'Iron',
      taxed: false
    },
    {
      name: 'Carrots',
      pricePerUnit: 10,
      currency: 'Iron',
      taxed: false
    },
    {
      name: 'Bread',
      pricePerUnit: 5,
      currency: 'Iron',
      taxed: false
    },
  ],


  
  // CREATE ORDER
  createOrder: function (client, interaction) {
    const newOrder = new Order({
      id: uuidv4(),
      status: 'ORDERING',
      shopName: 'Alpha Food and Supplies',
      customer: {
        displayName: interaction.member.displayName,
        id: interaction.member.id
      },
      shopOwner: {
        displayName: 'XCNinjaa',
        id: process.env['XCNINJAA_ID']
      },
      currentSelections: {
        currentName: 'Steak',
        currentPage: 1
      },
      supplies: [],
      totalPrice: {
        totalIron: 0,
        totalCoal: 0
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
  
    return {
      content: `**Welcome to Alpha Food and Supplies!**\n\n` +
        `Please fill out your order below:\n\n` +
        this.createOrderString(order),
      ephemeral: true,
      components: [
        new ActionRowBuilder().addComponents(nameSelectMenu),
        new ActionRowBuilder().addComponents(addToOrderButton),
        new ActionRowBuilder().addComponents(submitOrderButton, resetOrderButton, cancelOrderButton)
      ]
    };
  },



  // CREATE ORDER STRING
  createOrderString: function (order) {
    const { id, shopName, customer, shopOwner, supplies, totalPrice } = order;
    var orderString = '';
  
    // Add enchantments to order string
    for (const supply of supplies) {
      const { name, amount, pricePerUnit, currency } = supply;
  
      orderString += `[+${amount * pricePerUnit} ${currency}]` +
        ` ${name}: ${amount * 16}\n`;
    }

    orderString += `\n**SUBTOTAL:** ${totalPrice.totalIron} Iron\n`;
    orderString += `**SALES TAX:** ${totalPrice.totalCoal} Coal\n`
    orderString += `**TOTAL PRICE:** ${totalPrice.totalIron} Iron, ${totalPrice.totalCoal} Coal\n`;
  
    orderString += `\nCustomer: ${customer.displayName}\n` +
      `Shop Owner: ${shopOwner.displayName}\n` +
      `Order ID: ${id}\n` +
      `Shop Name: ${shopName}`;
  
    return orderString;
  },



  // SELECT NAME
  selectName: function (order, value) {
    order.currentSelections.currentName = value;

    return order; 
  },



  // RESET ORDER
  resetOrder: function (order) {
    order.currentSelections = {
      currentName: 'Steak',
      currentPage: 1
    };

    order.totalPrice = {
      totalIron: 0,
      totalCoal: 0
    };

    order.supplies = [];

    return order;
  },



  // ADD TO ORDER
  addToOrder: function (order) {
    const { supplies, currentSelections } = order;

    // Search to see if enchantment order exists
    const index = supplies.findIndex((supply) => supply.name == currentSelections.currentName);

    // If enchantment order exists, edit existing order
    if (index != -1) {
      const { taxed, pricePerUnit } = order.supplies[index];
      
      order.supplies[index].amount += 1;

      order.totalPrice.totalIron += pricePerUnit;

      if (taxed) order.totalPrice.totalCoal += 4;
      
    } else { // Create new enchantment order and push to enchantments array
      var result = {
        name: currentSelections.currentName,
        amount: 1
      };
      
      const currentItem = this.menu.find((item) => item.name == result.name);

      result.pricePerUnit = currentItem.pricePerUnit;
      result.currency = currentItem.currency;
      result.taxed = currentItem.taxed;

      order.totalPrice.totalIron += result.pricePerUnit;

      if (result.taxed) order.totalPrice.totalCoal += 4;

      order.supplies.push(result);
    }

    return order;
  },



  // VERIFY SUBMIT
  verifySubmit: function (order) {
    const { supplies } = order;
  
    return (supplies.length > 0);
  },



  // CREATE CUSTOMER RECEIPT
  createCustomerReceipt: function (order) {
    const { status } = order;
  
    var result = `**---CUSTOMER RECEIPT: ALPHA FOOD AND SUPPLIES---**\n\n` +
      `**STATUS: ${status}**\n\n` +
      `**ORDER SUMMARY:**\n\n` +
      this.createOrderString(order);
  
    return result;
  },



  // CREATE MERCHANT TICKET
  createMerchantTicket: function (order) {
    const { status } = order;
  
    var result = `**---MERCHANT TICKET: ALPHA FOOD AND SUPPLIES---**\n\n` +
      `**STATUS: ${status}**\n\n` +
      `**ORDER SUMMARY:**\n\n` +
      this.createOrderString(order);
  
    return result;
  }
};