const { Schema, model } = require('mongoose');

const orderAPSchema = new Schema({
  id: String,
  status: String,
  customer: { displayName: String, id: String },
  shopOwner: { displayName: String, id: String },
  currentSelections: {
    currentName: String,
    currentForm: String,
    currentEnhanced: String
  },
  potions: [ { name: String, form: String, amount: Number, enhanced: Number, pricePerUnit: Number, currency: String } ],
  totalPrice: {
    totalIron: Number,
    totalGold: Number,
    totalDiamond: Number
  },
  customerReceipt: String,
  merchantTicket: String
});

module.exports = model('OrderAP', orderAPSchema);