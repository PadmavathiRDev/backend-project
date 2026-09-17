const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createEcommerceCheckoutOrder,
} = require("../controllers/checkoutController");

const { verifyPayment } = require("../controllers/paymentController");

router.post(
  "/verify-payment",
  protect,
  verifyPayment
);

router.post("/create-order", protect, createEcommerceCheckoutOrder);

module.exports = router;