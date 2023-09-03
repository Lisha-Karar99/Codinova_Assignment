const Joi = require("joi");

// schema to validate sales
const sales_schema = Joi.object({
  invoice: Joi.string().trim().max(20).min(6).required(),
  date: Joi.date().required(),
  products: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().max(40).min(1).required(),
        quantity: Joi.number().min(1).required(),
        subtotal: Joi.number().required(),
      })
    )
    .required(),
  discount: Joi.number().optional(),
  vat: Joi.number().optional(),
  invoiceTotal: Joi.number().required(),
});

module.exports = { sales_schema };
