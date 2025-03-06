const Joi = require("joi");

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

// Schema for updating a user (all fields optional)
const updateUserSchema = Joi.object({
    userName: Joi.string().min(3).max(30).messages({
        "string.base": "Username must be a string",
        "string.min": "Username must have at least 3 characters",
        "string.max": "Username must have at most 30 characters",
    }),
    email: Joi.string().email().messages({
        "string.email": "Please enter a valid email address",
    }),
    password: Joi.string().min(6).messages({
        "string.min": "Password must have at least 6 characters",
    }),
    userImage: Joi.string(),
});

module.exports = { registerUserSchema, updateUserSchema };
