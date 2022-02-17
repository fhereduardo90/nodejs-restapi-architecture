export const documentation = {
  swagger: '2.0',
  info: {
    description:
      'This is the documentation for the Rest API architecture using Passport and Express for [RAVN](https://ravn.co)',
    version: '1.0.0',
    title: 'NodeJs Rest API architecture',
    contact: {
      email: 'fernando@ravn.co',
      name: 'Fernando Juarez',
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  host:
    process.env.NODE_ENV === 'production'
      ? ''
      : `localhost:${process.env.PORT}`,
  basePath: '/api/v1',
  tags: [
    {
      name: 'general',
      description: 'generics routes for the server',
    },
    {
      name: 'auth',
    },
    {
      name: 'users',
      description: 'routes for the current user authenticated',
    },
  ],
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
  paths: {
    '/status': {
      get: {
        tags: ['general'],
        consumes: ['application/json'],
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'The date of the server',
            schema: {
              type: 'object',
              properties: {
                time: {
                  type: 'string',
                  example: '2022-01-01T00:00:00.000Z',
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['auth'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: 'Ok',
            schema: {
              $ref: '#/definitions/Login',
            },
          },
          '400': {
            description: 'Bad Request',
            schema: {
              $ref: '#/definitions/Error',
            },
          },
          '401': {
            description: 'Forbidden',
            schema: {
              $ref: '#/definitions/Error',
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['auth'],
        consumes: ['application/json'],
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'Ok',
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
    },
    '/users': {
      get: {
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'The users registered',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/User',
              },
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
      post: {
        description: 'Create a new user',
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '201': {
            description: 'The new user created',
          },
        },
      },
    },
    '/users/me': {
      get: {
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        responses: {
          '200': {
            description: '',
            schema: {
              $ref: '#/definitions/User',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
      patch: {
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: '',
            schema: {
              $ref: '#/definitions/User',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
    },
    '/users/{uuid}': {
      get: {
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            description: 'The uuid for the user',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          '200': {
            description: 'Ok',
            schema: {
              $ref: '#/definitions/User',
            },
          },
          '404': {
            description: 'Not Found',
            schema: {
              $ref: '#/definitions/Error',
            },
          },
        },
      },
    },
    '/users/confirm-account': {
      post: {
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'token',
            in: 'query',
            type: 'string',
          },
        ],
        responses: {
          '204': {
            description: 'No Content',
          },
          '422': {
            description: 'Unprocessable Entity',
          },
        },
      },
    },
  },
  definitions: {
    User: {
      type: 'object',
      properties: {
        uuid: {
          type: 'string',
        },
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        createdAt: {
          type: 'string',
        },
      },
    },
    Login: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
        exp: {
          type: 'integer',
        },
      },
    },
    Error: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
        statusCode: {
          type: 'integer',
        },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              property: {
                type: 'string',
              },
              constraint: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
  securityDefinitions: {
    api_key: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
      description: 'Bearer <YOUR_TOKEN>',
    },
  },
}

export const documentation_v2 = {
  swagger: '2.0',
  info: {
    description:
      'This is the documentation for the Rest API architecture using Passport and Express for [RAVN](https://ravn.co)',
    version: '2.0.0',
    title: 'NodeJs Rest API architecture',
    contact: {
      email: 'fernando@ravn.co',
      name: 'Fernando Juarez',
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  host:
    process.env.NODE_ENV === 'production'
      ? ''
      : `localhost:${process.env.PORT}`,
  basePath: '/api/v1',
  tags: [
    {
      name: 'general',
      description: 'generics routes for the server',
    },
    {
      name: 'auth',
    },
    {
      name: 'users',
    },
    {
      name: 'admins',
    },
    {
      name: 'admins-master',
      description:
        'only for the admin with master type, also they can access to the admins routes',
    },
  ],
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
  paths: {
    '/status': {
      get: {
        tags: ['general'],
        consumes: ['application/json'],
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'The date of the server',
            schema: {
              type: 'object',
              properties: {
                time: {
                  type: 'string',
                  example: '2022-01-01T00:00:00.000Z',
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['auth'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: 'Ok',
            schema: {
              $ref: '#/definitions/Login',
            },
          },
          '400': {
            description: 'Bad Request',
            schema: {
              $ref: '#/definitions/Error',
            },
          },
          '401': {
            description: 'Forbidden',
            schema: {
              $ref: '#/definitions/Error',
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['auth'],
        consumes: ['application/json'],
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'Ok',
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
    },
    '/users': {
      get: {
        deprecated: true,
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'The users registered',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/User',
              },
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
      post: {
        deprecated: true,
        description: 'Create a new user',
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '201': {
            description: 'The new user created',
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
    },
    '/users/me': {
      get: {
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        responses: {
          '200': {
            description: '',
            schema: {
              $ref: '#/definitions/User',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
      patch: {
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: '',
            schema: {
              $ref: '#/definitions/User',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
    },
    '/users/{uuid}': {
      get: {
        deprecated: true,
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            description: 'The uuid for the user',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          '200': {
            description: 'Ok',
            schema: {
              $ref: '#/definitions/User',
            },
          },
          '404': {
            description: 'Not Found',
            schema: {
              $ref: '#/definitions/Error',
            },
          },
        },
      },
    },
    '/users/confirm-account': {
      post: {
        tags: ['users'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'token',
            in: 'query',
            type: 'string',
          },
        ],
        responses: {
          '204': {
            description: 'No Content',
          },
          '422': {
            description: 'Unprocessable Entity',
          },
        },
      },
    },
    '/admins/users/{uuid}': {
      get: {
        tags: ['admins'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            description: 'The uuid for the user',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          '200': {
            description: 'Ok',
            schema: {
              $ref: '#/definitions/User',
            },
          },
          '404': {
            description: 'Not Found',
            schema: {
              $ref: '#/definitions/Error',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
      patch: {
        summary: 'Only for admins with write access',
        tags: ['admins'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            description: 'The uuid for the user',
            required: true,
            type: 'string',
          },
          {
            in: 'body',
            name: 'body',
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: '',
            schema: {
              $ref: '#/definitions/User',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
      delete: {
        summary: 'Only for admins with write access',
        tags: ['admins'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            description: 'The uuid for the user',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          '200': {
            description: '',
            schema: {
              $ref: '#/definitions/User',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
    },
    '/admins/users': {
      post: {
        summary: 'Only for admins with write access',
        description: 'Create a new user',
        tags: ['admins'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '201': {
            description: 'The new user created',
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
      get: {
        tags: ['admins'],
        consumes: ['application/json'],
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'The users registered',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/User',
              },
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
    },
    '/admins': {
      post: {
        description: 'Create a new Admin',
        tags: ['admins-master'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            schema: {
              type: 'object',
              properties: {
                fullName: {
                  type: 'string',
                },
                type: {
                  type: 'string',
                  enum: ['master', 'write', 'read'],
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '201': {
            description: '',
            schema: {
              $ref: '#/definitions/Admin',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
      get: {
        description: 'Retrieves all the admins',
        tags: ['admins-master'],
        responses: {
          '200': {
            description: '',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Admin',
              },
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
    },
    '/admins/{uuid}': {
      delete: {
        tags: ['admins-master'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            description: 'The uuid for the admin',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          '200': {
            description: '',
            schema: {
              $ref: '#/definitions/Admin',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
      patch: {
        tags: ['admins-master'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            description: 'The uuid for the admin',
            required: true,
            type: 'string',
          },
          {
            in: 'body',
            name: 'body',
            schema: {
              type: 'object',
              properties: {
                fulName: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: '',
            schema: {
              $ref: '#/definitions/Admin',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
    },
    '/admins/me': {
      get: {
        tags: ['admins'],
        consumes: ['application/json'],
        produces: ['application/json'],
        responses: {
          '200': {
            description: '',
            schema: {
              $ref: '#/definitions/Admin',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
      patch: {
        tags: ['admins'],
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            schema: {
              type: 'object',
              properties: {
                fulName: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: '',
            schema: {
              $ref: '#/definitions/Admin',
            },
          },
        },
        security: [
          {
            api_key: [],
          },
        ],
      },
    },
  },
  definitions: {
    Admin: {
      type: 'object',
      properties: {
        uuid: {
          type: 'string',
        },
        type: {
          type: 'string',
          enum: ['master', 'write', 'read'],
        },
        fullName: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        createdAt: {
          type: 'string',
        },
      },
    },
    User: {
      type: 'object',
      properties: {
        uuid: {
          type: 'string',
        },
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        createdAt: {
          type: 'string',
        },
      },
    },
    Login: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
        exp: {
          type: 'integer',
        },
      },
    },
    Error: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
        statusCode: {
          type: 'integer',
        },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              property: {
                type: 'string',
              },
              constraint: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
  securityDefinitions: {
    api_key: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
      description: 'Bearer <YOUR_TOKEN>',
    },
  },
}
