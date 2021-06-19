import { celebrate, Segments, Joi } from 'celebrate';

const refreshTokenSchema = celebrate(
  {
    [Segments.COOKIES]: {
      rtid: Joi.string().required(),
      uid: Joi.string().required(),
    },
  },
  {
    allowUnknown: true,
  },
);

export default refreshTokenSchema;
