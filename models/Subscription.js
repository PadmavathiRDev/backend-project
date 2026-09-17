const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  planName: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    default: 0,
  },

  startDate: {
    type: Date,
    default: Date.now,
  },

  expiryDate: {
    type: Date,
    default: null,
  },

  status: {
    type: String,
    default: "Active",
  },
});

module.exports = mongoose.model(
  "Subscription",
  subscriptionSchema
);