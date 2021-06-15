import { celebrate, Segments, Joi } from 'celebrate';

const updateUserProfileSchema = celebrate(
  {
    [Segments.BODY]: {
      name: Joi.string(),
      email: Joi.string().email(),
      oldPassword: Joi.string(),
      password: Joi.string(),
      uf: Joi.string(),
      city: Joi.string(),
    },
  },
  {
    allowUnknown: true,
  },
);

export default updateUserProfileSchema;
