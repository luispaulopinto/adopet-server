import {
  statusCode400,
  statusCode401,
  statusCode404,
  statusCode500,
} from '../../responses';

const resetPasswordPath = {
  post: {
    tags: ['Password'],
    summary: 'Reset the user password to the new one specified',
    // description: '',
    requestBody: {
      description: 'Required fields for reset the user password.',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
              },
              password: {
                type: 'string',
                format: 'password',
              },
            },
            example: {
              token: 'lmvsifnsu#ksfns3gdkngbsno3ionssjnjwngnsdns',
              password: '123456',
            },
          },
        },
      },
    },
    responses: {
      '204': {
        description: 'Password changed successfully.',
      },
      '400': statusCode400,
      '401': statusCode401,
      '404': statusCode404,
      '500': statusCode500,
    },
  },
};

export default resetPasswordPath;
