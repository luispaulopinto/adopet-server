import {
  statusCode400,
  statusCode404,
  statusCode409,
  statusCode500,
} from '../responses';

const profilePath = {
  get: {
    tags: ['Profile'],
    summary: 'Get user profile',
    // description: '',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description:
          'The request was successfully. The response will contain a JSON body with user details.',
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
                phoneNumber: {
                  type: 'string',
                },
                uf: {
                  type: 'string',
                },
                city: {
                  type: 'string',
                },
                isOng: {
                  type: 'boolean',
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
                phoneNumber: '00000000000',
                uf: 'SP',
                city: 'São Paulo',
                isOng: false,
                createdAt: '2012-03-10T22:10:32.992Z',
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
  put: {
    tags: ['Profile'],
    summary: 'Update user profile',
    // description: '',
    security: [{ bearerAuth: [] }],
    requestBody: {
      description: 'Fields for update an user.',
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
              oldPassword: {
                type: 'string',
                format: 'password',
              },
              password: {
                type: 'string',
                format: 'password',
              },
              uf: {
                type: 'string',
              },
              city: {
                type: 'string',
              },
            },
            example: {
              name: 'User',
              email: 'new@user.com',
              oldPassword: '123456',
              password: '654321',
              uf: 'SP',
              city: 'São Paulo',
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description:
          'User updated successfully. The response will contain a JSON body with user details.',
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
                uf: {
                  type: 'string',
                },
                city: {
                  type: 'string',
                },
                isOng: {
                  type: 'boolean',
                },
                updatedAt: {
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
                uf: 'SP',
                city: 'São Paulo',
                isOng: false,
                updatedAt: '2012-03-10T22:10:32.992Z',
                avatarURL: 'http://example.com/image.jpg',
              },
            },
          },
        },
      },
      '400': statusCode400,
      '404': statusCode404,
      '409': statusCode409,
      '500': statusCode500,
    },
  },
};

export default profilePath;
