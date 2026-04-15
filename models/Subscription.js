const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  plan: String,
  paymentId: String,
  status: String,

  startDate: Date,
  endDate: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Subscription", schema);
