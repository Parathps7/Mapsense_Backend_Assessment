const Joi = require('@hapi/joi');

const authRSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(5).required(),
})

const authLSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(5).required(),
})

const locationSchema = Joi.object({
    latitude:Joi.number().min(-90).max(90).required(),
    longitude:Joi.number().min(-180).max(180).required()
  });

const fpassword = Joi.object({
    email: Joi.string().email().lowercase().required()
});

const rpassword = Joi.object({
    password: Joi.string().min(5).required()
});

const dist = Joi.object({
    coordinate1: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    }).required(),
    coordinate2: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    }).required()
  });


module.exports = {
    authRSchema,
    authLSchema,
    locationSchema,
    fpassword,
    rpassword,
    dist
}