const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },

        productName:{
            type:String
        },

        quantity:{
            type:Number,
            required:true
        },

        price:{
            type:Number,
            required:true
        }
    }
    ], 
    
    totalAmount: {
      type: Number,
      required: true,
    },

    paymentId: {
      type: String,
    },

    razorpayOrderId: {
      type: String,
    },

    razorpaySignature: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    shippingAddress: {
      type: String,
    },

    phoneNumber: {
      type: String,
    },

    orderNotes: {
      type: String,
    },

    statusHistory: [
      {
        status: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);