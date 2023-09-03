const mongoose = require("mongoose");

// creating schema
const salesSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
      required: true,
    },
    empId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    date: {
      type: Date,
      default: new Date(),
      required: true,
    },
    products: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    discount: {
      type: Number,
      required: false,
    },
    vat: {
      type: Number,
      required: false,
    },
    invoiceTotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// sales model
const salesModel = mongoose.model("sales", salesSchema);

module.exports = salesModel;
