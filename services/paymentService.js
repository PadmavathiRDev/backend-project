const Razorpay = require("razorpay");
const PLANS = require("../config/plans");

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});

exports.createOrderService = async (planKey) => {
  const plan = PLANS[planKey];

  if (!plan) throw new Error("Invalid Plan");

  const order = await razorpay.orders.create({
    amount: plan.amount,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  });

  return { order, plan };
};