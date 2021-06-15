import { celebrate, Segments, Joi } from 'celebrate';

// .messages({
//   'string.base': `Email should be a type of 'text'.`,
//   'string.empty': `Email is required.`,
//   'any.required': `Email is required.`,
// }),

const authenticationSchema = celebrate(
  {
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
  {
    allowUnknown: true,
  },
);

export default authenticationSchema;
