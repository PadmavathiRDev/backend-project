const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Subscription = require("../models/Subscription"); //added for free plan

const {
  saveInvoice,
  getInvoices,
} = require("../services/paymentService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amountPaise } = req.body;

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const verified =
      generatedSignature === razorpay_signature;
      if (!verified) {
  return res.status(400).json({
    verified: false,
    message: "Payment verification failed",
  });
}

    const paymentDetails =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );
     
     const dbUser = await User.findById(req.user.userId).lean();

     if (!dbUser) {
  return res.status(404).json({
    message: "User not found",
  });
}

      await Payment.create({
       userId: dbUser._id,

       customerName: dbUser.name,
       customerEmail: dbUser.email,
       customerMobile: dbUser.mobile,
       customerAddress: dbUser.address || "",

       paymentMethod: paymentDetails.method,
       wallet: paymentDetails.wallet,
       upiId: paymentDetails.vpa,
       bank: paymentDetails.bank,

       planName: req.body.planName,
       amount: req.body.amount / 100,
       cardLast4: paymentDetails.card?.last4,
       cardNetwork: paymentDetails.card?.network,
       cardIssuer: paymentDetails.card?.issuer,
       cardType: paymentDetails.card?.type,

       razorpay_order_id,
       razorpay_payment_id,
       razorpay_signature,
  
       });
       //free plan

       exports.activateFreePlan = async (req, res) => {
  try {
    const userId = req.user.userId;

    const dbUser = await User.findById(userId);

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const subscription = await Subscription.findOneAndUpdate(
      { userId: String(userId) },
      {
        userId: String(userId),
        planName: "Basic",
        amount: 0,
        startDate: new Date(),
        expiryDate: null,
        status: "Active",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Free plan activated successfully",
      subscription,
    });

  } catch (error) {
    console.error("Activate Free Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to activate free plan",
      error: error.message,
    });
  }
};
      // ==========================================
      // ECOMMERCE ORDER UPDATE & CART CLEAR
      // ==========================================

      const order = await Order.findOne({
        razorpayOrderId: razorpay_order_id,
      });

      if (order) {
        await Order.updateOne(
          { _id: order._id },
          {
            paymentStatus: "Paid",
            orderStatus: "Processing",
            paymentId: razorpay_payment_id,
          }
        );

        const purchasedProductIds = order.products.map(
          (item) => item.product
        );

        await Cart.updateOne(
          { userId: order.user },
          {
            $pull: {
              products: {
                productId: { $in: purchasedProductIds },
              },
            },
          }
        );
      }
      
      // Save invoice
    const savedInvoice = await saveInvoice({
      userId: dbUser._id,
      paymentId: razorpay_payment_id,
      amount: req.body.amount / 100,
      gst: req.body.gst || 0,
      planName: req.body.planName || "",
      status: "Paid",
    });
      // User object
      const user = {
       name: dbUser?.name || "",
       email: dbUser?.email || "",
       mobile: dbUser?.mobile || "",
       address: dbUser?.address || "",
     };

      // Payment details object
      const paymentResponse = {
  paymentId: razorpay_payment_id,
  orderId: razorpay_order_id,

  method: paymentDetails.method,
  bank: paymentDetails.bank,
  wallet: paymentDetails.wallet,
  upiId: paymentDetails.vpa,

  amount: paymentDetails.amount / 100,
  currency: paymentDetails.currency,

  paymentDate: new Date(paymentDetails.created_at * 1000),

  paymentMethodLabel:
    paymentDetails.method === "netbanking"
      ? paymentDetails.bank
      : paymentDetails.method === "upi"
      ? "UPI"
      : paymentDetails.method === "card"
      ? paymentDetails.card?.network
      : paymentDetails.method,
};
      return res.status(200).json({
  verified: true,
  user,
  paymentDetails: paymentResponse,
  invoice: savedInvoice,
});

    // Payment verification failed
    
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.handleWebhook = async (req, res) => {
  try {

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Webhook Signature",
      });
    }

    const body = JSON.parse(req.body.toString());

    const event = body.event;

    if (event === "payment.captured") {

      const payment = body.payload.payment.entity;

      const paymentExists = await Payment.findOne({
        razorpay_payment_id: payment.id,
      });

      if (!paymentExists) {
        return res.status(200).json({
          success: true,
          message: "Payment record not found",
        });
      }

      await Payment.findOneAndUpdate(
        {
          razorpay_payment_id: payment.id,
        },
        {
          paymentStatus: "Success",
        }
      );

      await Order.findOneAndUpdate(
        {
          razorpayOrderId: payment.order_id,
        },
        {
          paymentStatus: "Paid",
          orderStatus: "Processing",
        }
      );

      console.log("Payment Captured");
    }

    if (event === "payment.failed") {

      const payment = body.payload.payment.entity;

      const paymentExists = await Payment.findOne({
          razorpay_payment_id: payment.id
      });

      if(!paymentExists){
          return res.status(200).json({
              success:true,
              message:"Payment record not found"
          });
      }

      await Payment.findOneAndUpdate(
        {
          razorpay_payment_id: payment.id,
        },
        {
          paymentStatus: "Failed",
        }
      );

    await Order.findOneAndUpdate(
      {
        razorpayOrderId: payment.order_id,
      },
      {
        paymentStatus: "Failed",
      }
    );
      console.log("Payment Failed");
    }

    res.status(200).json({
      success: true,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
};

// Get invoices
exports.getInvoices = async (req, res) => {
  try {
    const userId = req.user.userId;

    const invoices = await getInvoices(userId);

    return res.status(200).json({
      success: true,
      invoices,
    });
  } catch (error) {
    console.error(
      "Get invoices error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};


// Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const {
      paymentId,
      amount,
      gst = 0,
      planName = "",
      status = "Paid",
    } = req.body;

    if (!paymentId || amount === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "paymentId and amount are required",
      });
    }

    const invoice = await saveInvoice({
      userId: req.user.userId,
      paymentId,
      amount,
      gst,
      planName,
      status,
    });

    return res.status(201).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error(
      "Create invoice error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};