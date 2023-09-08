const { v4: uuidv4 } = require("uuid");
const Order = require('../schemas/OrderCBS.js');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  // SHOP NAME
  shopName: 'Chip\'s Building Supply Store',

  // SHOP CODE
  shopCode: 'CBS',


  
  // MENU
  menu: [ 
    {
      category: 'Wood',
      items: [ 'Oak', 'Dark Oak', 'Spruce', 'Birch', 'Jungle', 'Acacia', 'Mangrove' ],
      forms: [ 'Logs', 'Planks' ],
      itemsPerUnit: 64,
      pricePerUnit: 20,
      currency: 'Iron'
    }, 
    {
      category: 'Stone',
      items: [
        {
          name: 'Smoothstone',
          itemsPerUnit: 64,
          pricePerUnit: 5,
          currency: 'Iron'
        }, 
        {
          name: 'Cobblestone',
          itemsPerUnit: 64,
          pricePerUnit: 1,
          currency: 'Iron'
        },
        {
          name: 'Bricks (block)',
          itemsPerUnit: 64,
          pricePerUnit: 20,
          currency: 'Iron'
        },
        {
          name: 'Stone Bricks',
          itemsPerUnit: 64,
          pricePerUnit: 10,
          currency: 'Iron'
        },
        {
          name: 'Sandstone',
          itemsPerUnit: 64,
          pricePerUnit: 20,
          currency: 'Iron'
        },
        {
          name: 'Nether Quartz (block)',
          itemsPerUnit: 64,
          pricePerUnit: 5,
          currency: 'Diamond'
        },
        {
          name: 'Sand',
          itemsPerUnit: 64,
          pricePerUnit: 5,
          currency: 'Iron'
        },
        {
          name: 'Gravel',
          itemsPerUnit: 64,
          pricePerUnit: 10,
          currency: 'Iron'
        },
        {
          name: 'Andesite',
          itemsPerUnit: 64,
          pricePerUnit: 20,
          currency: 'Iron'
        },
        {
          name: 'Diorite',
          itemsPerUnit: 64,
          pricePerUnit: 5,
          currency: 'Iron'
        },
        {
          name: 'Granite',
          itemsPerUnit: 64,
          pricePerUnit: 10,
          currency: 'Iron'
        }
      ]
    },
    {
      category: 'Dirt',
      items: [ 
        {
          name: 'Dirt',
          itemsPerUnit: 64,
          pricePerUnit: 1,
          currency: 'Iron'
        }, 
        {
          name: 'Coarse Dirt',
          itemsPerUnit: 64,
          pricePerUnit: 1,
          currency: 'Diamond'
        }, 
        {
          name: 'Podzol',
          itemsPerUnit: 64,
          pricePerUnit: 30,
          currency: 'Iron'
        }
      ]
    },
    {
      category: 'Materials',
      items: [ 
        {
          name: 'Bricks (item)',
          itemsPerUnit: 64,
          pricePerUnit: 10,
          currency: 'Iron'
        }, 
        {
          name: 'Clay',
          itemsPerUnit: 64,
          pricePerUnit: 5,
          currency: 'Iron'
        }, 
        {
          name: 'Redstone Dust',
          itemsPerUnit: 64,
          pricePerUnit: 5,
          currency: 'Gold'
        }, 
        {
          name: 'Glowstone Dust',
          itemsPerUnit: 64,
          pricePerUnit: 5,
          currency: 'Gold'
        }
      ]
    },
    {
      category: 'Furniture',
      items: [ 
        {
          name: 'Torches',
          itemsPerUnit: 4,
          pricePerUnit: 1,
          currency: 'Gold'
        }, 
        {
          name: 'Lantern',
          itemsPerUnit: 1,
          pricePerUnit: 5,
          currency: 'Gold'
        }, 
        {
          name: 'Cauldron',
          itemsPerUnit: 1,
          pricePerUnit: 5,
          currency: 'Diamond'
        }, 
        {
          name: 'Anvil',
          itemsPerUnit: 1,
          pricePerUnit: 10,
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
      shopName: 'Chip\'s Building Supply Store',
      customer: {
        displayName: interaction.member.displayName,
        id: interaction.member.id
      },
      shopOwner: {
        displayName: 'Lupey3',
        id: process.env['LUPEY3_ID']
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
    
    var result = {
      content: `**Welcome to Chip's Building Supply Store!**\n\n` +
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
    
    if (category == 'Wood') {
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
    } else {
      for (const item of items) {
        const { name } = item;
        
        nameSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
          label: name,
          value: name,
          default: (currentSelections.currentName == name)
        }));
      }

      result.components.push(new ActionRowBuilder().addComponents(nameSelectMenu));
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
      const { category, name, form, amount, itemsPerUnit, pricePerUnit, currency } = item;
  
      orderString += `[+${amount * pricePerUnit} ${currency}]` +
        ` ${name}`;
      orderString += (category == 'Wood') ? ` ${form}` : '';
      orderString += `: ${amount * itemsPerUnit}\n`;
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

    return order; 
  },



  // SELECT CATEGORY
  selectCategory: function (order, value) {
    order.currentSelections.currentCategory = value;

    const currentCategory = this.menu.find((cat) => cat.category == value);
    
    if (value == 'Wood') {
      order.currentSelections.currentForm = currentCategory.forms[0];
      order.currentSelections.currentName = currentCategory.items[0];
    } else {
      order.currentSelections.currentName = currentCategory.items[0].name;
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
      totalGold: 0,
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
      }

      return condition;
    });

    // If item order exists, edit existing order
    if (index != -1) {
      const { amount, pricePerUnit, currency } = order.itemOrders[index];

      order.itemOrders[index].amount += 1;

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

    } else { // Create new item order and push to itemOrders array
      var result = {
        category: currentSelections.currentCategory,
        name: currentSelections.currentName,
        amount: 1
      };

      if (currentSelections.currentCategory == 'Wood') {
        result.form = currentSelections.currentForm;
      }

      const currentCategory = this.menu.find((itemObj) => itemObj.category == currentSelections.currentCategory);

      if (currentCategory.category == 'Wood') {
        result.pricePerUnit = currentCategory.pricePerUnit;
        result.currency = currentCategory.currency;
        result.itemsPerUnit = currentCategory.itemsPerUnit;
      } else {
        const currentItem = currentCategory.items.find((item) => item.name == currentSelections.currentName);

        result.pricePerUnit = currentItem.pricePerUnit;
        result.currency = currentItem.currency;
        result.itemsPerUnit = currentItem.itemsPerUnit;
      }

      switch (result.currency) {
        case 'Iron':
          order.totalPrice.totalIron += result.pricePerUnit;
          break;
        case 'Gold':
          order.totalPrice.totalGold += result.pricePerUnit;
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
  
    var result = `**---CUSTOMER RECEIPT: CHIP'S BUILDING SUPPLY STORE---**\n\n` +
      `**STATUS: ${status}**\n\n` +
      `**ORDER SUMMARY:**\n\n` +
      this.createOrderString(order);
  
    return result;
  },



  // CREATE MERCHANT TICKET
  createMerchantTicket: function (order) {
    const { status } = order;
  
    var result = `**---MERCHANT TICKET: CHIP'S BUILDING SUPPLY STORE---**\n\n` +
      `**STATUS: ${status}**\n\n` +
      `**ORDER SUMMARY:**\n\n` +
      this.createOrderString(order);
  
    return result;
  }
};