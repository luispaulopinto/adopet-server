import { celebrate, Segments, Joi } from 'celebrate';

const forgotPasswordSchema = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
  },
});

const resetPasswordSchema = celebrate({
  [Segments.BODY]: {
    password: Joi.string().required(),
    token: Joi.string().required(),
  },
});

export { forgotPasswordSchema, resetPasswordSchema };
