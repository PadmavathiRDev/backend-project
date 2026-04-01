const { createOrderService } = require("../services/paymentService");
const verifySignature = require("../utils/verifySignature");
const Subscription = require("../models/Subscription");

exports.createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    const { order, plan: selectedPlan } =
      await createOrderService(plan);

    res.json({
      orderId: order.id,
      amount: selectedPlan.amount,
      plan: selectedPlan.name
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const isValid = verifySignature(req.body);

    if (!isValid) {
      return res.status(400).json({ success: false });
    }

    // Save in DB
    await Subscription.create({
      userId: "demoUser", // replace with auth user
      plan: req.body.plan,
      paymentId: req.body.razorpay_payment_id,
      status: "SUCCESS"
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
