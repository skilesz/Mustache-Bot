const { v4: uuidv4 } = require("uuid");
const Order = require('../schemas/OrderAE.js');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  // SHOP NAME
  shopName: 'Alpha Enchantments',

  // SHOP CODE
  shopCode: 'AE',


  
  // MENU
  menu: [ 
    {
      name: 'Aqua Affinity',
      maxLevel: 1
    }, {
      name: 'Bane of Arthropods',
      maxLevel: 5
    }, {
      name: 'Blast Protection',
      maxLevel: 4
    }, {
      name: 'Channeling',
      maxLevel: 1
    }, {
      name: 'Depth Strider',
      maxLevel: 3
    }, {
      name: 'Efficiency',
      maxLevel: 5
    }, {
      name: 'Feather Falling',
      maxLevel: 4
    }, {
      name: 'Fire Aspect',
      maxLevel: 2
    }, {
      name: 'Fire Protection',
      maxLevel: 4
    }, {
      name: 'Flame',
      maxLevel: 1
    }, {
      name: 'Fortune',
      maxLevel: 3
    }, {
      name: 'Frost Walker',
      maxLevel: 2
    }, {
      name: 'Impaling',
      maxLevel: 5
    }, {
      name: 'Infinity',
      maxLevel: 1
    }, {
      name: 'Knockback',
      maxLevel: 2
    }, {
      name: 'Loyalty',
      maxLevel: 3
    }, {
      name: 'Looting',
      maxLevel: 3
    }, {
      name: 'Luck of the Sea',
      maxLevel: 3
    }, {
      name: 'Lure',
      maxLevel: 3
    }, {
      name: 'Mending',
      maxLevel: 1
    }, {
      name: 'Multishot',
      maxLevel: 1
    }, {
      name: 'Piercing',
      maxLevel: 4
    }, {
      name: 'Power',
      maxLevel: 5
    }, {
      name: 'Projectile Protection',
      maxLevel: 4
    }, {
      name: 'Protection',
      maxLevel: 4
    }, {
      name: 'Punch',
      maxLevel: 2
    }, {
      name: 'Quick Charge',
      maxLevel: 3
    }, {
      name: 'Respiration',
      maxLevel: 3
    }, {
      name: 'Riptide',
      maxLevel: 3
    }, {
      name: 'Sharpness',
      maxLevel: 5
    }, {
      name: 'Silk Touch',
      maxLevel: 1
    }, {
      name: 'Smite',
      maxLevel: 5
    }, {
      name: 'Thorns',
      maxLevel: 3
    }, {
      name: 'Unbreaking',
      maxLevel: 3
    } 
  ],


  
  // CREATE ORDER
  createOrder: function (client, interaction) {
    const newOrder = new Order({
      id: uuidv4(),
      status: 'ORDERING',
      shopName: 'Alpha Enchantments',
      customer: {
        displayName: interaction.member.displayName,
        id: interaction.member.id
      },
      shopOwner: {
        displayName: 'bigsaltyball',
        id: process.env['BIGSALTYBALL_ID']
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

    for (var i = 0 + ((currentSelections.currentPage - 1) * 25); i < (currentSelections.currentPage * 25); i++) {
      if (this.menu[i]) {
        const { name } = this.menu[i];
  
        nameSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
          label: name,
          value: name,
          default: (currentSelections.currentName == name)
        }));
      }
    }

    const currentItem = this.menu.find((item) => currentSelections.currentName == item.name);
    
    var levelSelectMenu = new StringSelectMenuBuilder()
      .setCustomId('levelSelect')
      .setMinValues(1)
      .setMaxValues(1);
  
    switch (currentItem.maxLevel) {
      case 5:
        levelSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
          label: 'V',
          value: 'V',
          default: (currentSelections.currentLevel == 'V')
        }));
      case 4:
        levelSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
          label: 'IV',
          value: 'IV',
          default: (currentSelections.currentLevel == 'IV')
        }));
      case 3:
        levelSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
          label: 'III',
          value: 'III',
          default: (currentSelections.currentLevel == 'III')
        }));
      case 2:
        levelSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
          label: 'II',
          value: 'II',
          default: (currentSelections.currentLevel == 'II')
        }));
      default:
        levelSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
          label: 'I',
          value: 'I',
          default: (currentSelections.currentLevel == 'I')
        }));
        break;
    }

    const previousPageButton = new ButtonBuilder()
      .setCustomId('previousPage')
      .setLabel('Previous Page')
      .setStyle(ButtonStyle.Secondary);
  
    const nextPageButton = new ButtonBuilder()
      .setCustomId('nextPage')
      .setLabel('Next Page')
      .setStyle(ButtonStyle.Secondary);
  
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
      content: `**Welcome to Alpha Enchantments!**\n\n` +
        `Please fill out your order below:\n\n` +
        this.createOrderString(order),
      ephemeral: true,
      components: [
        new ActionRowBuilder().addComponents(nameSelectMenu),
        new ActionRowBuilder().addComponents(levelSelectMenu)
      ]
    };
  
    if (currentSelections.currentPage < totalPages && currentSelections.currentPage > 1) {
      result.components.push(new ActionRowBuilder().addComponents(addToOrderButton, previousPageButton, nextPageButton));
    } else if (currentSelections.currentPage == totalPages && currentSelections.currentPage > 1) {
      result.components.push(new ActionRowBuilder().addComponents(addToOrderButton, previousPageButton));
    } else if (currentSelections.currentPage < totalPages && currentSelections.currentPage == 1) {
      result.components.push(new ActionRowBuilder().addComponents(addToOrderButton, nextPageButton));
    } else {
      result.components.push(new ActionRowBuilder().addComponents(addToOrderButton));
    }
  
    result.components.push(new ActionRowBuilder().addComponents(submitOrderButton, resetOrderButton, cancelOrderButton));
  
    return result;
  },



  // CREATE ORDER STRING
  createOrderString: function (order) {
    const { id, shopName, customer, shopOwner, enchantments, totalPrice } = order;
    var orderString = '';
  
    // Add enchantments to order string
    for (const enchantment of enchantments) {
      const { name, level, amount, pricePerUnit, currency } = enchantment;
  
      orderString += `[+${amount * pricePerUnit} ${currency}]` +
        ` ${name} ${level}: ${amount} book(s)\n`;
    }
  
    orderString += `\n**TOTAL PRICE:** ${totalPrice.totalDiamond} Diamond\n`;
  
    orderString += `\nCustomer: ${customer.displayName}\n` +
      `Shop Owner: ${shopOwner.displayName}\n` +
      `Order ID: ${id}\n` +
      `Shop Name: ${shopName}`;
  
    return orderString;
  },



  // SELECT NAME
  selectName: function (order, value) {
    order.currentSelections.currentName = value;
    order.currentSelections.currentLevel = 'I';

    return order; 
  },



  // NEXT PAGE
  nextPage: function (order) {
    order.currentSelections.currentPage += 1;
    order.currentSelections.currentName = this.menu[(25 * (order.currentSelections.currentPage - 1))].name;
    order.currentSelections.currentLevel = 'I';

    return order;
  },



  // PREVIOUS PAGE
  previousPage: function (order) {
    order.currentSelections.currentPage -= 1;
    order.currentSelections.currentName = this.menu[(25 * (order.currentSelections.currentPage - 1))].name;
    order.currentSelections.currentLevel = 'I';

    return order;
  },



  // RESET ORDER
  resetOrder: function (order) {
    order.currentSelections = {
      currentName: 'Mending',
      currentLevel: 'I',
      currentPage: 1
    };

    order.totalPrice = {
      totalDiamond: 0
    };

    order.enchantments = [];

    return order;
  },



  // ADD TO ORDER
  addToOrder: function (order) {
    const { enchantments, currentSelections } = order;

    // Search to see if enchantment order exists
    const index = enchantments.findIndex((enchantment) => (enchantment.name == currentSelections.currentName &&
                                                          enchantment.level == currentSelections.currentLevel));

    // If enchantment order exists, edit existing order
    if (index != -1) {
      const { level, amount, pricePerUnit } = order.enchantments[index];
      
      order.enchantments[index].amount += 1;

      order.totalPrice.totalDiamond += pricePerUnit;
      
    } else { // Create new enchantment order and push to enchantments array
      var result = {
        name: currentSelections.currentName,
        level: currentSelections.currentLevel,
        amount: 1
      };
      
      switch (currentSelections.currentLevel) {
        case 'V':
          result.pricePerUnit = 25;
          break;
        case 'IV':
          result.pricePerUnit = 20;
          break;
        case 'III':
          result.pricePerUnit = 15;
          break;
        case 'II':
          result.pricePerUnit = 10;
          break;
        default:
          result.pricePerUnit = 5;
          break;
      }

      result.currency = 'Diamond';

      order.totalPrice.totalDiamond += result.pricePerUnit;

      order.enchantments.push(result);
    }

    return order;
  },



  // VERIFY SUBMIT
  verifySubmit: function (order) {
    const { enchantments } = order;
  
    return (enchantments.length > 0);
  },



  // CREATE CUSTOMER RECEIPT
  createCustomerReceipt: function (order) {
    const { status } = order;
  
    var result = `**---CUSTOMER RECEIPT: ALPHA ENCHANTMENTS---**\n\n` +
      `**STATUS: ${status}**\n\n` +
      `**ORDER SUMMARY:**\n\n` +
      this.createOrderString(order);
  
    return result;
  },



  // CREATE MERCHANT TICKET
  createMerchantTicket: function (order) {
    const { status } = order;
  
    var result = `**---MERCHANT TICKET: ALPHA ENCHANTMENTS---**\n\n` +
      `**STATUS: ${status}**\n\n` +
      `**ORDER SUMMARY:**\n\n` +
      this.createOrderString(order);
  
    return result;
  }
};