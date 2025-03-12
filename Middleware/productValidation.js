const Joi = require("joi");
const mongoose=require('mongoose')

// Schema for adding a project (all fields required)
const addProductSchema = Joi.object({
    productName: Joi.string().min(5).max(100).required().messages({
        "string.base": "Name of product must be a string",
        "string.empty": "Product name is required",
        "string.min": "Product name must have at least 5 characters",
        "string.max": "Product name must have at most 100 characters",
        "any.required": "Product name is required",
    }),
    brand:Joi.string().min(2).max(20).required().messages({
        "string.base": "Brand name must be a string",
        "string.empty": "Brand name is required",
        "string.min": "Brand name must have at least 2 characters",
        "string.max": "Brand name must have at most 20 characters",
        "any.required": "Brand name is required"
    }),
    description:Joi.string().min(20).max(250).required().messages({
        "string.base": "Product description must be a string",
        "string.empty": "Product description is required",
        "string.min": "Product description must have at least 20 characters",
        "string.max": "Product description must have at most 250 characters",
        "any.required": "Product description is required"
    }),
    discountedPrice:Joi.number().min(10).required().messages({
        "number.base": "Discounted price must be a number",
        "number.empty": "Discounted price is required",
        "number.min": "Discounted price must have at least 10 rupees",
        "any.required": "Discounted price is required"
    }),
    actualPrice:Joi.number().min(10).required().messages({
        "number.base": "Actual price must be a number",
        "number.empty": "Actual price is required",
        "number.min": "Actual price must have at least 10 rupees",
        "any.required": "Actual price is required"
    }),
    productCategory:Joi.string().min(3).max(30).required().messages({
        "string.base": "Product category must be a string",
        "string.empty": "Product category is required",
        "string.min": "Product category must have at least 3 characters",
        "string.max": "Product category must have at most 30 characters",
        "any.required": "Product category is required"
    }),
});
// Schema for updating product 
const updateProductSchema = Joi.object({
    productName: Joi.string().min(5).max(100).messages({
        "string.base": "Name of product must be a string",
        "string.empty": "Product name is required",
        "string.min": "Product name must have at least 5 characters",
        "string.max": "Product name must have at most 50 characters",
    }),
    brand:Joi.string().min(2).max(20).messages({
        "string.base": "Brand name must be a string",
        "string.empty": "Brand name is required",
        "string.min": "Brand name must have at least 2 characters",
        "string.max": "Brand name must have at most 20 characters",
    }),
    description:Joi.string().min(20).max(250).messages({
        "string.base": "Product description must be a string",
        "string.empty": "Product description is required",
        "string.min": "Product description must have at least 20 characters",
        "string.max": "Product description must have at most 250 characters",
    }),
    discountedPrice:Joi.number().min(10).messages({
        "number.base": "Discounted price must be a number",
        "number.empty": "Discounted price is required",
        "number.min": "Discounted price must have at least 10 rupees",
    }),
    actualPrice:Joi.number().min(10).messages({
        "number.base": "Actual price must be a number",
        "number.empty": "Actual price is required",
        "number.min": "Actual price must have at least 10 rupees",
    }),
    productCategory:Joi.string().min(3).max(30).messages({
        "string.base": "Product category must be a string",
        "string.empty": "Product category is required",
        "string.min": "Product category must have at least 3 characters",
        "string.max": "Product category must have at most 30 characters",
    }),
});

const addNewBrand = Joi.object({
    brandName: Joi.string().min(2).max(20).required().messages({
        "string.base": "Name of brand must be a string",
        "string.empty": "Brand name is required",
        "string.min": "Brand name must have at least 2 characters",
        "string.max": "Brand name must have at most 20 characters",
        "any.required": "Brand name is required",
    }),
    brandImage: Joi.string(),
    brandCategory: Joi.alternatives().try(
        Joi.array().items(
            Joi.string().min(2).max(30).messages({
                "string.base": "Each category must be a string",
                "string.empty": "Category cannot be empty",
                "string.min": "Category must have at least 2 characters",
                "string.max": "Category must have at most 30 characters",
            })
        ),
        Joi.string() 
    ).required().messages({
        "any.required": "At least one brand category is required",
    }),
});


const updateABrand = Joi.object({
    brandName: Joi.string().min(2).max(20).messages({
        "string.base": "Name of brand must be a string",
        "string.empty": "Brand name is required",
        "string.min": "Brand name must have at least 2 characters",
        "string.max": "Brand name must have at most 20 characters",
        "any.required": "Brand name is required",
    }),
    brandImage: Joi.string(),
    brandCategory: Joi.alternatives().try(
        Joi.array().items(
            Joi.string().min(2).max(30).messages({
                "string.base": "Each category must be a string",
                "string.empty": "Category cannot be empty",
                "string.min": "Category must have at least 2 characters",
                "string.max": "Category must have at most 30 characters",
            })
        ),
        Joi.string() 
    ),
});


// Middleware function for validation of req.body
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map((err) => err.message) });
        }
        next();
    };
};

// Middleware function for validation of req.params
const validateObjectId = (paramName) => {
    return (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
            return res.status(400).json({ message: `Invalid ${paramName} format` });
        }
        next();
    };
};

module.exports = { 
    validateProduct: validateRequest(addProductSchema), 
    validateUpdateProduct: validateRequest(updateProductSchema), 
    validateAddBrand: validateRequest(addNewBrand), 
    validateUpdateBrand: validateRequest(updateABrand), 
    validateObjectId
};