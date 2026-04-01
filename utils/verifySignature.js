const crypto = require("crypto");

module.exports = (data) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  const generated_signature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  return generated_signature === razorpay_signature;
};