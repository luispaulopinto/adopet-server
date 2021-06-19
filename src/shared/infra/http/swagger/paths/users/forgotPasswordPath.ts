import {
  statusCode400,
  statusCode401,
  statusCode404,
  statusCode500,
} from '../../responses';

const forgotPasswordPath = {
  post: {
    tags: ['Password'],
    summary: 'Sends a forgot password email to the user',
    // description: '',
    requestBody: {
      description: 'Required fields for send forgot password email.',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
              },
            },
            example: {
              email: 'new@user.com',
            },
          },
        },
      },
    },
    responses: {
      '204': {
        description: 'Forgot password email sent successfully.',
      },
      '400': statusCode400,
      '401': statusCode401,
      '404': statusCode404,
      '500': statusCode500,
    },
  },
};

export default forgotPasswordPath;
