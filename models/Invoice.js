const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  userId: String,
  invoiceId: String,
  plan: String,
  amount: Number,
  status: String,
  filePath: String,
  date: Date
});

module.exports = mongoose.model("Invoice", invoiceSchema);
