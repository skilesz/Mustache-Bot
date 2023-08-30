const { Schema, model } = require('mongoose');

const orderCBSSchema = new Schema({
  id: String,
  status: String,
  shopName: String,
  customer: { displayName: String, id: String },
  shopOwner: { displayName: String, id: String },
  currentSelections: {
    currentCategory: String,
    currentName: String,
    currentForm: String,
    currentPage: Number
  },
  itemOrders: [{ category: String, name: String, form: String, amount: Number, itemsPerUnit: Number, pricePerUnit: Number, currency: String }],
  totalPrice: {
    totalIron: Number,
    totalGold: Number
  },
  customerReceipt: String,
  merchantTicket: String
});

module.exports = model('OrderCBS', orderCBSSchema);