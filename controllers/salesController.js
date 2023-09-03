const Sales = require("../model/salesModel");
const { sales_schema } = require("../model/validate/salesValidate");

module.exports.storeSalesDetails = async (req, res) => {
  try {
    await sales_schema.validateAsync(req.body);
    // storing data into database
    const salesDetails = await Sales.create({
      invoice: req.body.invoice,
      empId: req.user.id,
      date: req.body.date,
      products: req.body.products,
      discount: req.body.discount || 0,
      vat: req.body.vat || 0,
      invoiceTotal: req.body.invoiceTotal,
    });
    return res.status(201).json({
      data: {
        salesDetails: salesDetails,
      },
      message: "Sales details stored Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
