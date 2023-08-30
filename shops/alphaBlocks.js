const { v4: uuidv4 } = require("uuid");
const Order = require('../schemas/OrderAB.js');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  // SHOP NAME
  shopName: 'Alpha Blocks',

  // SHOP CODE
  shopCode: 'AB',


  
  // MENU
  menu: [ 
    {
      category: 'Wood',
      items: [ 'Oak', 'Dark Oak', 'Spruce', 'Birch', 'Jungle', 'Acacia', 'Mangrove' ],
      forms: [ 'Logs', 'Planks' ],
      itemsPerUnit: 32,
      pricePerUnit: 5,
      currency: 'Iron'
    },
    {
      category: 'Materials',
      items: [ 
        {
          name: 'Glass',
          itemsPerUnit: 32,
          pricePerUnit: 5,
          currency: 'Iron'
        }, 
        {
          name: 'Wool',
          colors: [ 'White', 'Light Gray', 'Gray', 'Black', 'Brown', 'Red', 'Orange', 'Yellow', 'Lime', 'Green', 'Cyan', 'Light Blue', 'Blue', 'Purple', 'Magenta', 'Pink' ],
          itemsPerUnit: 32,
          pricePerUnit: 5,
          currency: 'Iron'
        }, 
        {
          name: 'Cobblestone',
          itemsPerUnit: 64,
          pricePerUnit: 5,
          currency: 'Iron'
        }, 
        {
          name: 'Redstone Blocks',
          itemsPerUnit: 3,
          pricePerUnit: 10,
          currency: 'Iron'
        },
        {
          name: 'Obsidian',
          itemsPerUnit: 3,
          pricePerUnit: 1,
          currency: 'Diamond'
        }
      ]
    }
  ],


  
  // CREATE ORDER
  createOrder: function (client, interaction) {
    const newOrder = new Order({
      id: uuidv4(),
      status: 'ORDERING',
      shopName: 'Alpha Blocks',
      customer: {
        displayName: interaction.member.displayName,
        id: interaction.member.id
      },
      shopOwner: {
        displayName: 'XCNinjaa',
        id: process.env['XCNINJAA_ID']
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
        totalDiamond: 0
      }
    });

    return newOrder;
  },


  
  // CREATE ORDER FORM
  createOrderForm: function (order) {
    const { currentSelections } = order;
    const totalPages = Math.ceil(this.menu.length / 25);
    
    var result = {
      content: `**Welcome to Alpha Blocks!**\n\n` +
        `Please fill out your order below:\n\n` +
        this.createOrderString(order),
      ephemeral: true,
      components: []
    };
  
    var categorySelectMenu = new StringSelectMenuBuilder()
      .setCustomId('categorySelect')
      .setMinValues(1)
      .setMaxValues(1);
  
    var nameSelectMenu = new StringSelectMenuBuilder()
      .setCustomId('nameSelect')
      .setMinValues(1)
      .setMaxValues(1);
  
    var formSelectMenu = new StringSelectMenuBuilder()
      .setCustomId('formSelect')
      .setMinValues(1)
      .setMaxValues(1);

    var colorSelectMenu = new StringSelectMenuBuilder()
      .setCustomId('colorSelect')
      .setMinValues(1)
      .setMaxValues(1);
  
    for (const item of this.menu) {
      const { category } = item;
      
      categorySelectMenu.addOptions(new StringSelectMenuOptionBuilder({
        label: category,
        value: category,
        default: (currentSelections.currentCategory == category)
      }));
    }
  
    result.components.push(new ActionRowBuilder().addComponents(categorySelectMenu));
  
    var currentCategory = this.menu.find((itemObj) => itemObj.category == currentSelections.currentCategory);
    const { category, items } = currentCategory;
    
    switch (category) {
      case 'Wood':
        for (const item of items) {
          nameSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
            label: item,
            value: item,
            default: (currentSelections.currentName == item)
          }));
        }
  
        for (const form of currentCategory.forms) {
          formSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
            label: form,
            value: form,
            default: (currentSelections.currentForm == form)
          }));
        }
  
        result.components.push(new ActionRowBuilder().addComponents(nameSelectMenu));
        result.components.push(new ActionRowBuilder().addComponents(formSelectMenu));
        break;
      case 'Materials':
        for (const item of items) {
          const { name } = item;
          
          nameSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
            label: name,
            value: name,
            default: (currentSelections.currentName == name)
          }));

          if (name == 'Wool') {
            for (const color of item.colors) {
              colorSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
                label: color,
                value: color,
                default: (currentSelections.currentColor == color)
              }));
            }
          }
        }
  
        result.components.push(new ActionRowBuilder().addComponents(nameSelectMenu));

        if (currentSelections.currentName == 'Wool') {
          result.components.push(new ActionRowBuilder().addComponents(colorSelectMenu));
        }
        
        break;
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
  
    result.components.push(new ActionRowBuilder().addComponents(addToOrderButton));
    result.components.push(new ActionRowBuilder().addComponents(submitOrderButton, resetOrderButton, cancelOrderButton));
  
    return result;
  },



  // CREATE ORDER STRING
  createOrderString: function (order) {
    const { id, shopName, customer, shopOwner, itemOrders, totalPrice } = order;
    var orderString = '';
  
    // Add enchantments to order string
    for (const item of itemOrders) {
      const { category, name, form, color, amount, itemsPerUnit, pricePerUnit, currency } = item;
  
      orderString += `[+${amount * pricePerUnit} ${currency}]` +
        ` ${name}`;
      orderString += (category == 'Wood') ? ` ${form}` : '';
      orderString += (name == 'Wool') ? ` (${color})` : '';
      orderString += `: ${amount * itemsPerUnit}\n`;
    }
  
    orderString += `\n**TOTAL PRICE:** ${totalPrice.totalIron} Iron, ${totalPrice.totalDiamond} Diamond\n`;
  
    orderString += `\nCustomer: ${customer.displayName}\n` +
      `Shop Owner: ${shopOwner.displayName}\n` +
      `Order ID: ${id}\n` +
      `Shop Name: ${shopName}`;
  
    return orderString;
  },



  // SELECT NAME
  selectName: function (order, value) {
    order.currentSelections.currentName = value;

    const currentItem = this.menu.find((cat) => cat.category == order.currentSelections.currentCategory).items.find((item) => item.name == value);
    
    if (value == 'Wool') order.currentSelections.currentColor = currentItem.colors[0];

    return order;
  },



  // SELECT CATEGORY
  selectCategory: function (order, value) {
    order.currentSelections.currentCategory = value;

    const currentCategory = this.menu.find((cat) => cat.category == value);
    
    switch (value) {
      case 'Wood':
        order.currentSelections.currentForm = currentCategory.forms[0];
        order.currentSelections.currentName = currentCategory.items[0];
        break;
      case 'Materials':
        order.currentSelections.currentName = currentCategory.items[0].name;
        break;
    }

    return order;
  },



  // RESET ORDER
  resetOrder: function (order) {
    order.currentSelections = {
      currentCategory: 'Wood',
      currentName: 'Oak',
      currentForm: 'Logs',
      currentPage: 1
    };
    
    order.totalPrice = {
      totalIron: 0,
      totalDiamond: 0
    };

    order.itemOrders = [];

    return order;
  },



  // ADD TO ORDER
  addToOrder: function (order) {
    const { itemOrders, currentSelections } = order;

    // Search to see if item order exists
    const index = itemOrders.findIndex((itemObj) => {
      var condition = (itemObj.name == currentSelections.currentName);

      if (currentSelections.currentCategory == 'Wood') {
        condition = condition && (itemObj.form == currentSelections.currentForm);
      } else if (currentSelections.currentName == 'Wool') {
        condition = condition && (itemObj.color == currentSelections.currentColor);
      }

      return condition;
    });

    // If potions order exists, edit existing order
    if (index != -1) {
      const { amount, pricePerUnit, currency } = order.itemOrders[index];

      order.itemOrders[index].amount += 1;

      switch (currency) {
        case 'Iron':
          order.totalPrice.totalIron += pricePerUnit;
          break;
        case 'Diamond':
          order.totalPrice.totalDiamond += pricePerUnit;
          break;
      }

    } else { // Create new potion order and push to potions array
      var result = {
        category: currentSelections.currentCategory,
        name: currentSelections.currentName,
        amount: 1
      };

      if (currentSelections.currentCategory == 'Wood') {
        result.form = currentSelections.currentForm;
      } else if (currentSelections.currentName == 'Wool') {
        result.color = currentSelections.currentColor;
      }

      const currentCategory = this.menu.find((itemObj) => itemObj.category == currentSelections.currentCategory);

      switch (currentCategory.category) {
        case 'Wood':
          result.pricePerUnit = currentCategory.pricePerUnit;
          result.currency = currentCategory.currency;
          result.itemsPerUnit = currentCategory.itemsPerUnit;
          break;
        case 'Materials':
          const currentItem = currentCategory.items.find((item) => item.name == currentSelections.currentName);

          result.pricePerUnit = currentItem.pricePerUnit;
          result.currency = currentItem.currency;
          result.itemsPerUnit = currentItem.itemsPerUnit;
          break;
      }

      switch (result.currency) {
        case 'Iron':
          order.totalPrice.totalIron += result.pricePerUnit;
          break;
        case 'Diamond':
          order.totalPrice.totalDiamond += result.pricePerUnit;
          break;
      }

      order.itemOrders.push(result);
    }

    return order;
  },



  // VERIFY SUBMIT
  verifySubmit: function (order) {
    const { itemOrders } = order;
  
    return (itemOrders.length > 0);
  },



  // CREATE CUSTOMER RECEIPT
  createCustomerReceipt: function (order) {
    const { status } = order;
  
    var result = `**---CUSTOMER RECEIPT: ALPHA BLOCKS---**\n\n` +
      `**STATUS: ${status}**\n\n` +
      `**ORDER SUMMARY:**\n\n` +
      this.createOrderString(order);
  
    return result;
  },



  // CREATE MERCHANT TICKET
  createMerchantTicket: function (order) {
    const { status } = order;
  
    var result = `**---MERCHANT TICKET: ALPHA BLOCKS---**\n\n` +
      `**STATUS: ${status}**\n\n` +
      `**ORDER SUMMARY:**\n\n` +
      this.createOrderString(order);
  
    return result;
  }
};