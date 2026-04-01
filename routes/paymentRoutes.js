const router = require("express").Router();
const controller = require("../controllers/paymentController");

router.post("/create-order", controller.createOrder);
router.post("/verify", controller.verifyPayment);

module.exports = router;