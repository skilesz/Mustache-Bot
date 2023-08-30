const { Schema, model } = require('mongoose');

const orderAESchema = new Schema({
  id: String,
  status: String,
  shopName: String,
  customer: { displayName: String, id: String },
  shopOwner: { displayName: String, id: String },
  currentSelections: {
    currentName: String,
    currentLevel: String,
    currentPage: Number
  },
  totalPages: Number,
  enchantments: [{ name: String, level: String, amount: Number, pricePerUnit: Number, currency: String }],
  totalPrice: {
    totalDiamond: Number
  },
  customerReceipt: String,
  merchantTicket: String
});

module.exports = model('OrderAE', orderAESchema);