const Product = require("../model/productModel.js");
const {
  product_schema,
  product_update_schema,
  delete_schema,
  category_schema,
  name_schema,
} = require("../model/validate/productValidate.js");
const path = require("path");
const fs = require("fs");

module.exports.storeProduct = async (req, res) => {
  try {
    await product_schema.validateAsync(req.body);

    let productDetails = {
      name: req.body.name,
      category: req.body.category,
      unitPrice: req.body.unitPrice,
      quantity: req.body.quantity,
    };

    Product.uploadImage(req, res, async function (err) {
      try {
        if (err) {
          throw new Error("Error in uploading file");
        }
        // if file is uploaded by user
        if (req.file) {
          // add image
          productDetails.image = Product.filePath + "/" + req.file.filename;
        }
        // storing data into database
        const product = await Product.create(productDetails);
        return res.status(201).json({
          data: {
            product: product,
          },
          message: "Product stored Successfully",
        });
      } catch (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
    });
  } catch (err) {
    // if get a joi validation err
    if (err.name === "ValidationError") {
      return res.status(422).json({
        message: err.message,
      });
    }
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    await product_update_schema.validateAsync(req.params);
    let product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product doesn't exist");
      error.name = "NOT FOUND";
      throw error;
    }

    if (req.body.name) product.name = req.body.name;
    if (req.body.category) product.category = req.body.category;
    if (req.body.quantity) product.quantity = req.body.quantity;
    if (req.body.unitPrice) product.unitPrice = req.body.unitPrice;

    Product.uploadImage(req, res, async function (err) {
      try {
        if (err) {
          throw new Error("Error in uploading file");
        }
        // if file is uploaded by user
        if (req.file) {
          // if file exist in uploads folder then delete that and add new one
          if (
            product.image &&
            fs.existsSync(path.join(__dirname, "..", product.image))
          ) {
            fs.unlinkSync(path.join(__dirname, "..", product.image));
          }
          product.image = Product.filePath + "/" + req.file.filename;
        }
        // updating data into database
        product.save();
        return res.status(200).json({
          message: "Product updated Successfully",
        });
      } catch (err) {
        // if get a joi validation err
        if (err.name === "ValidationError") {
          return res.status(422).json({
            message: err.message,
          });
        }

        return res.status(400).json({
          message: err.message,
        });
      }
    });
  } catch (err) {
    // if not found
    if (err.name === "NOT FOUND") {
      return res.status(404).json({
        message: err.message,
      });
    }
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    await delete_schema.validateAsync(req.params);
    let product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product doesn't exist",
      });
    }
    return res.status(200).json({
      message: "Product deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.getAllCategory = async (req, res) => {
  try {
    let category = await Product.find({}, { _id: 0, category: 1 }).lean();
    return res.status(200).json({
      data: {
        categoryList: category,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.getProductByCategory = async (req, res) => {
  try {
    await category_schema.validateAsync(req.params);
    let productList = await Product.find(
      { category: req.params.category },
      {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      }
    ).lean();
    return res.status(200).json({
      data: {
        productList: productList,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.getProductByName = async (req, res) => {
  try {
    await name_schema.validateAsync(req.params);
    let productList = await Product.aggregate([
      {
        $match: {
          name: { $regex: req.params.name, $options: "i" },
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);
    return res.status(200).json({
      data: {
        productList: productList,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
