const mongoose = require('mongoose');

// Schema for a product entry within an invoice
const InvoiceProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hsnCode: { type: String },
  sku: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  taxSlab: { type: Number, required: true } // Tax percentage (e.g., 18 for 18%)
}, { _id: false });

// Schema for a payment record
const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
}, { _id: false });

// Main Invoice Schema
const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerContact: { type: String, required: true },
  specifiedDate: { type: Date, required: true },
  products: [InvoiceProductSchema],
  totalAmount: { type: Number, required: true },
  totalTax: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'ready', 'paid'], default: 'draft' },
  payments: [PaymentSchema],
  balance: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
