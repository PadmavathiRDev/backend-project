const Razorpay = require("razorpay");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Project = require("../models/Project");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createEcommerceCheckoutOrder = async (req, res) => {
  try {
    
    const {
      workspaceId,
      items,
      customerName,
      customerEmail,
    } = req.body;

    // ==========================================
    // AUTH USER
    // ==========================================
    const userId =
      req.user?.userId ||
      req.user?.id ||
      req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // ==========================================
    // RESOLVE WORKSPACE FROM AUTH USER
    // ==========================================
    const workspace = await Project.findOne({
      userId: userId,
    }).sort({ createdAt: -1 });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found for this user",
      });
    }

    const resolvedWorkspaceId = workspace._id;

    // ==========================================
    // VALIDATIONS
    // ==========================================
    
    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "Workspace ID is required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required",
      });
    }

    let totalAmount = 0;
    const orderProducts = [];

    // ==========================================
    // VALIDATE PRODUCTS
    // ==========================================

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid product or quantity",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.inventory < quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.inventory} item(s) available`,
        });
      }
      totalAmount += product.price * quantity;

      orderProducts.push({
        product: product._id,
        productName: product.name,
        quantity,
        price: product.price,
      });
    }

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    // ==========================================
    // CREATE MONGODB ORDER
    // ========================================== 
    const mongoOrder = await Order.create({
      
      workspaceId: resolvedWorkspaceId,
      
      user: userId,

      products: orderProducts,

      totalAmount,

      paymentStatus: "Pending",

      orderStatus: "Pending",

      razorpayOrderId: razorpayOrder.id,

      paymentId: null,

      shippingAddress: "",

      phoneNumber: "",

      orderNotes: "",
    });
    
    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      order: mongoOrder,

      payment: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });

  } catch (error) {
    console.error("Checkout Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

