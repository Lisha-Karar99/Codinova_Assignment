const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const PRODUCT_FILE_PATH = path.join("/uploads");

// creating schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// storing files into disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", PRODUCT_FILE_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
productSchema.statics.uploadImage = multer({ storage: storage }).single(
  "image"
);
productSchema.statics.filePath = PRODUCT_FILE_PATH;

productSchema.index({ category: 1, name: 1 }, { unique: true });
// product model
const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
