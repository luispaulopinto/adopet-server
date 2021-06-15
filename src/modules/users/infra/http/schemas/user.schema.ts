import { celebrate, Segments, Joi } from 'celebrate';

const createUserSchema = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    isOng: Joi.boolean().required(),
  },
});

export default createUserSchema;
