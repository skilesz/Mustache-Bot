const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const createOrderForm = require('../../utils/createOrderFormAP.js');
const OrderAP = require('../../schemas/OrderAP.js');

module.exports = {
  data: {
    name: 'addToOrderAP'
  },
  async execute(client, interaction) {
    var contentLength = interaction.message.content.length;
    var orderID = interaction.message.content.substring(contentLength - 36, contentLength);

    var message = await interaction.deferUpdate();

    const query = { id: orderID };

    try {
      const order = await OrderAP.findOne(query);

      if (!order) {
        console.log('WARNING (addToOrderAP.js): Order does not exist')
        return;
      }

      const { potions, currentSelections } = order;

      // Search to see if potion order exists
      const index = potions.findIndex((potion) => (potion.name == currentSelections.currentName &&
                                                   potion.form == currentSelections.currentForm));

      // If potions order exists, edit existing order
      if (index != -1) {
        const { amount, enhanced, pricePerUnit, currency } = order.potions[index];
        
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
        
        switch (currentSelections.currentForm + currentSelections.currentName) {
          case 'BottledSwiftness':
          case 'SplashSwiftness':
            result.pricePerUnit = 10;
            result.currency = 'Iron';
            break;
          case 'LingeringSwiftness':
            result.pricePerUnit = 30;
            result.currency = 'Iron';
            break;
          case 'BottledSlowness':
          case 'SplashSlowness':
            result.pricePerUnit = 30;
            result.currency = 'Iron';
            break;
          case 'LingeringSlowness':
            result.pricePerUnit = 90;
            result.currency = 'Iron';
            break;
          case 'BottledLeaping':
          case 'SplashLeaping':
            result.pricePerUnit = 5;
            result.currency = 'Diamond';
            break;
          case 'LingeringLeaping':
            result.pricePerUnit = 10;
            result.currency = 'Diamond';
            break;
          case 'BottledStrength':
          case 'SplashStrength':
            result.pricePerUnit = 2;
            result.currency = 'Diamond';
            break;
          case 'LingeringStrength':
            result.pricePerUnit = 4;
            result.currency = 'Diamond';
            break;
          case 'BottledHealing':
          case 'SplashHealing':
            result.pricePerUnit = 5;
            result.currency = 'Gold';
            break;
          case 'LingeringHealing':
            result.pricePerUnit = 25;
            result.currency = 'Gold';
            break;
          case 'BottledHarming':
          case 'SplashHarming':
            result.pricePerUnit = 30;
            result.currency = 'Iron';
            break;
          case 'LingeringHarming':
            result.pricePerUnit = 90;
            result.currency = 'Iron';
            break;
          case 'BottledPoison':
          case 'SplashPoison':
            result.pricePerUnit = 10;
            result.currency = 'Iron';
            break;
          case 'LingeringPoison':
            result.pricePerUnit = 30;
            result.currency = 'Iron';
            break;
          case 'BottledRegeneration':
          case 'SplashRegeneration':
            result.pricePerUnit = 3;
            result.currency = 'Diamond';
            break;
          case 'LingeringRegeneration':
            result.pricePerUnit = 6;
            result.currency = 'Diamond';
            break;
          case 'BottledFire Resistance':
          case 'SplashFire Resistance':
            result.pricePerUnit = 4;
            result.currency = 'Diamond';
            break;
          case 'LingeringFire Resistance':
            result.pricePerUnit = 8;
            result.currency = 'Diamond';
            break;
          case 'BottledWater Breathing':
          case 'SplashWater Breathing':
            result.pricePerUnit = 15;
            result.currency = 'Iron';
            break;
          case 'LingeringWater Breathing':
            result.pricePerUnit = 45;
            result.currency = 'Iron';
            break;
          case 'BottledNight Vision':
          case 'SplashNight Vision':
            result.pricePerUnit = 5;
            result.currency = 'Gold';
            break;
          case 'LingeringNight Vision':
            result.pricePerUnit = 25;
            result.currency = 'Gold';
            break;
          case 'BottledInvisibility':
          case 'SplashInvisibility':
            result.pricePerUnit = 8;
            result.currency = 'Gold';
            break;
          case 'LingeringInvisibility':
            result.pricePerUnit = 40;
            result.currency = 'Gold';
            break;
          case 'BottledTurtle Master':
          case 'SplashTurtle Master':
            result.pricePerUnit = 5;
            result.currency = 'Diamond';
            break;
          case 'LingeringTurtle Master':
            result.pricePerUnit = 10;
            result.currency = 'Diamond';
            break;
          case 'BottledSlow Falling':
          case 'SplashSlow Falling':
            result.pricePerUnit = 3;
            result.currency = 'Diamond';
            break;
          case 'LingeringSlow Falling':
            result.pricePerUnit = 6;
            result.currency = 'Diamond';
            break;
          case 'BottledWeakness':
          case 'SplashWeakness':
            result.pricePerUnit = 20;
            result.currency = 'Iron';
            break;
          case 'LingeringWeakness':
            result.pricePerUnit = 60;
            result.currency = 'Iron';
            break;
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

        if (currentSelections.currentEnhanced == 'Enhanced') {
          order.totalPrice.totalIron += 20;
        }

        order.potions.push(result);
      }

      const orderForm = createOrderForm(order);

      const nameSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('nameSelectAP')
        .setMinValues(1)
        .setMaxValues(1)
        .setOptions(new StringSelectMenuOptionBuilder({
          label: 'Swiftness',
          value: 'Swiftness',
          default: (currentSelections.currentName == 'Swiftness')
        }), new StringSelectMenuOptionBuilder({
          label: 'Slowness',
          value: 'Slowness',
          default: (currentSelections.currentName == 'Slowness')
        }), new StringSelectMenuOptionBuilder({
          label: 'Leaping',
          value: 'Leaping',
          default: (currentSelections.currentName == 'Leaping')
        }), new StringSelectMenuOptionBuilder({
          label: 'Strength',
          value: 'Strength',
          default: (currentSelections.currentName == 'Strength')
        }), new StringSelectMenuOptionBuilder({
          label: 'Healing',
          value: 'Healing',
          default: (currentSelections.currentName == 'Healing')
        }), new StringSelectMenuOptionBuilder({
          label: 'Harming',
          value: 'Harming',
          default: (currentSelections.currentName == 'Harming')
        }), new StringSelectMenuOptionBuilder({
          label: 'Poison',
          value: 'Poison',
          default: (currentSelections.currentName == 'Poison')
        }), new StringSelectMenuOptionBuilder({
          label: 'Regeneration',
          value: 'Regeneration',
          default: (currentSelections.currentName == 'Regeneration')
        }), new StringSelectMenuOptionBuilder({
          label: 'Fire Resistance',
          value: 'Fire Resistance',
          default: (currentSelections.currentName == 'Fire Resistance')
        }), new StringSelectMenuOptionBuilder({
          label: 'Water Breathing',
          value: 'Water Breathing',
          default: (currentSelections.currentName == 'Water Breathing')
        }), new StringSelectMenuOptionBuilder({
          label: 'Night Vision',
          value: 'Night Vision',
          default: (currentSelections.currentName == 'Night Vision')
        }), new StringSelectMenuOptionBuilder({
          label: 'Invisibility',
          value: 'Invisibility',
          default: (currentSelections.currentName == 'Invisibility')
        }), new StringSelectMenuOptionBuilder({
          label: 'Turtle Master',
          value: 'Turtle Master',
          default: (currentSelections.currentName == 'Turtle Master')
        }), new StringSelectMenuOptionBuilder({
          label: 'Slow Falling',
          value: 'Slow Falling',
          default: (currentSelections.currentName == 'Slow Falling')
        }), new StringSelectMenuOptionBuilder({
          label: 'Weakness',
          value: 'Weakness',
          default: (currentSelections.currentName == 'Weakness')
        }));

      const formSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('formSelectAP')
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
        .setCustomId('enhancedSelectAP')
        .setMinValues(1)
        .setMaxValues(1)
        .setOptions(new StringSelectMenuOptionBuilder({
          label: 'Regular',
          value: 'Regular',
          default: (currentSelections.currentEnhanced == 'Regular')
        }));

      switch (currentSelections.currentName) {
        case 'Swiftness':
        case 'Slowness':
        case 'Leaping':
        case 'Strength':
        case 'Healing':
        case 'Harming':
        case 'Poison':
        case 'Regeneration':
        case 'Turtle Master':
          enhancedSelectMenu.addOptions(new StringSelectMenuOptionBuilder({
            label: 'Enhanced',
            value: 'Enhanced',
            default: (currentSelections.currentEnhanced == 'Enhanced')
          }));
          break;
        default:
          break;
      }

      orderForm.components[0] = new ActionRowBuilder().addComponents(nameSelectMenu);
      orderForm.components[1] = new ActionRowBuilder().addComponents(formSelectMenu);
      orderForm.components[2] = new ActionRowBuilder().addComponents(enhancedSelectMenu);

      await message.edit(orderForm);
      
      // Save order to database
      await order.save().catch((e) => {
        console.log(`ERROR (addToOrderAP.js): ${e}`);
      });
      
    } catch (err) {
      console.log(`ERROR (addToOrderAP.js): ${err}`);
    }
  }
};