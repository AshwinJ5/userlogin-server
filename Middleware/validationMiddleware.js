const Joi = require("joi");
const mongoose=require('mongoose')

// Schema for registering a user (all fields required)
const registerUserSchema = Joi.object({
    userName: Joi.string().min(3).max(30).required().messages({
        "string.base": "Username must be a string",
        "string.empty": "Username is required",
        "string.min": "Username must have at least 3 characters",
        "string.max": "Username must have at most 30 characters",
        "any.required": "Username is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must have at least 6 characters",
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
    userImage: Joi.string().optional(),
});

// Schema for log in a user (all fields optional)
const loginUserSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must have at least 6 characters",
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
    userImage: Joi.string().optional(),
});

// Schema for updating a user (all fields optional)
const updateUserSchema = Joi.object({
    userName: Joi.string().min(3).max(30).messages({
        "string.base": "Username must be a string",
        "string.min": "Username must have at least 3 characters",
        "string.max": "Username must have at most 30 characters",
        "string.empty": "Username field is empty",
    }),
    email: Joi.string().email().messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email field is empty",
    }),
    password: Joi.string().min(6).messages({
        "string.min": "Password must have at least 6 characters",
        "string.empty": "Password field is empty",
    }),
    userImage: Joi.string(),
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
    validateRegisterUser: validateRequest(registerUserSchema), 
    validateUpdateUser: validateRequest(updateUserSchema),
    validateLoginUser: validateRequest(loginUserSchema),
    validateObjectId
};