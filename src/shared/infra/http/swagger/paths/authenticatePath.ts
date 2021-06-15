import {
  statusCode400,
  statusCode401,
  statusCode404,
  statusCode500,
} from '../responses';

const usersPath = {
  post: {
    tags: ['Authenticate'],
    summary: 'Authenticate the user',
    // description: '',
    requestBody: {
      description: 'Required fields to authenticate user.',
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
              password: {
                type: 'string',
                format: 'password',
              },
            },
            example: {
              email: 'new@user.com',
              password: '123456',
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description:
          'User authenticated successfully. The response will contain a JSON body with user details.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                name: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                  format: 'email',
                },
                avatarURL: {
                  type: 'string',
                },
              },
              example: {
                id: 'a32d8169-56ef-4d48-a2c1-a595ff748116',
                name: 'New User',
                email: 'new@user.com.br',
                avatarURL: 'http://example.com/image.jpg',
              },
            },
          },
        },
      },
      '400': statusCode400,
      '401': statusCode401,
      '404': statusCode404,
      '500': statusCode500,
    },
  },
};

export default usersPath;
