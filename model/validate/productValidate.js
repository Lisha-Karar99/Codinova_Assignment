const Joi = require("joi");

const product_schema = Joi.object({
  name: Joi.string().trim().max(40).min(1).required(),
  category: Joi.string().trim().max(40).min(1).required(),
  unitPrice: Joi.number().required(),
  quantity: Joi.number().min(1).required(),
  image: Joi.optional()
});

const product_update_schema = Joi.object({
    id: Joi.string().trim().required(),
});

const delete_schema = Joi.object({
    id: Joi.string().trim().required()
})

const category_schema =Joi.object({
    category: Joi.string().trim().max(40).min(1).required(),
})

const name_schema =Joi.object({
    name: Joi.string().trim().max(40).min(1).required(),
})

module.exports = { product_schema, product_update_schema, delete_schema, category_schema, name_schema };
