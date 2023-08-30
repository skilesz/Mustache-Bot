const { Schema, model } = require('mongoose');

const orderAFSSchema = new Schema({
  id: String,
  status: String,
  shopName: String,
  customer: { displayName: String, id: String },
  shopOwner: { displayName: String, id: String },
  currentSelections: {
    currentName: String,
    currentPage: Number
  },
  supplies: [ { name: String, taxed: Boolean, amount: Number, pricePerUnit: Number, currency: String } ],
  totalPrice: {
    totalIron: Number,
    totalCoal: Number
  },
  customerReceipt: String,
  merchantTicket: String
});

module.exports = model('OrderAFS', orderAFSSchema);