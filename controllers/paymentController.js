const { createOrderService } = require("../services/paymentService");
const verifySignature = require("../utils/verifySignature");
const Subscription = require("../models/Subscription");
const PLANS = require("../config/plans");
const { generateInvoice } = require("../services/invoiceService");
const Invoice = require("../models/Invoice");

// Create Razorpay Order
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


// Verify Payment & Save Subscription
exports.verifyPayment = async (req, res) => {
  try {
    const isValid = verifySignature(req.body);

    if (!isValid) {
      return res.status(400).json({ success: false });
    }

    const { plan } = req.body;
    const selectedPlan = PLANS[plan];

    if (!selectedPlan) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    // Subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Save subscription
    await Subscription.create({
      userId: req.user?.id || "demoUser", // replace properly
      plan: selectedPlan.name,
      paymentId: req.body.razorpay_payment_id,
      status: "SUCCESS",
      startDate,
      endDate
    });

    // Generate invoice
    const invoiceId = "INV-" + Date.now();
    const filePath = `invoices/${invoiceId}.pdf`;

    await generateInvoice({
      invoiceId,
      date: new Date(),
      plan: selectedPlan.name,
      amount: selectedPlan.amount
    }, filePath);

    // Save invoice in DB
    await Invoice.create({
      userId: req.user?.id || "demoUser",
      invoiceId,
      plan: selectedPlan.name,
      amount: selectedPlan.amount,
      status: "Paid",
      filePath,
      date: new Date()
    });

    res.json({
      success: true,
      invoiceId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
