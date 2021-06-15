const statusCode400 = {
  description:
    'The request was invalid and/or malformed. The response will contain an Errors JSON Object with the specific error.',
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
        //   message: '"Email" is required.',
        // },
      },
    },
  },
};

export default statusCode400;
