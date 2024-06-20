// validators/dtoValidation.js
const Joi = require('joi');

const eventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  tags: Joi.array().items(Joi.string()).optional(),
  eventTime: Joi.date().iso().required(),
  location: Joi.string().required()
});

module.exports = {
  validateEvent: (eventData) => {
    const validation = eventSchema.validate(eventData);
    if (validation.error) {
      throw new Error(validation.error.details[0].message);
    }
    return validation.value;
  }
};
