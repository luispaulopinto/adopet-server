const statusCode409 = {
  description: 'The resource that a client tried to create already exists.',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
        // example: {
        //   status: 'error',
        //   message: 'Email already in used.',
        // },
      },
    },
  },
};

export default statusCode409;
