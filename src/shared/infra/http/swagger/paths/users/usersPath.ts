import {
  statusCode400,
  statusCode404,
  statusCode409,
  statusCode500,
} from '../../responses';

const usersPath = {
  post: {
    tags: ['Users'],
    summary: 'Create a new user',
    // description: '',
    requestBody: {
      description: 'Required fields to create an user.',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
                format: 'password',
              },
            },
            example: {
              name: 'New User',
              email: 'new@user.com',
              password: '123456',
            },
          },
        },
      },
    },
    responses: {
      '201': {
        description:
          'User created successfully. The response will contain a JSON body with user details.',
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
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                },
                avatarURL: {
                  type: 'string',
                },
              },
              example: {
                id: 'a32d8169-56ef-4d48-a2c1-a595ff748116',
                name: 'New User',
                email: 'new@user.com.br',
                createdAt: '2012-03-10T22:10:32.992Z',
                avatarURL: 'http://example.com/image.jpg',
              },
            },
          },
        },
      },
      '400': statusCode400,
      '409': statusCode409,
      '500': statusCode500,
    },
  },
  patch: {
    tags: ['Users'],
    summary: 'Update user avatar',
    // description: '',
    security: [{ bearerAuth: [] }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              avatar: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description:
          'User avatar updated successfully. The response will contain a JSON body with user details.',
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
                isOng: {
                  type: 'boolean',
                },
                updateAt: {
                  type: 'string',
                  format: 'date-time',
                },
                avatarURL: {
                  type: 'string',
                },
              },
              example: {
                id: 'a32d8169-56ef-4d48-a2c1-a595ff748116',
                name: 'New User',
                email: 'new@user.com.br',
                isong: false,
                updateAt: '2012-03-10T22:10:32.992Z',
                avatarURL: 'http://example.com/image.jpg',
              },
            },
          },
        },
      },
      '400': statusCode400,
      '404': statusCode404,
      '500': statusCode500,
    },
  },
};

export default usersPath;
