export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Inbox API',
    version: '1.0.0',
    description: 'API for Telegram webhook integration and inbox operations.',
  },
  paths: {
    '/webhooks/telegram': {
      post: {
        summary: 'Telegram webhook handler',
        parameters: [
          {
            in: 'query',
            name: 'secret',
            schema: { type: 'string' },
            required: true,
            description: 'Webhook secret for validation',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                description: 'Raw Telegram update payload',
              },
            },
          },
        },
        responses: {
          '200': { description: 'Webhook processed' },
          '401': { description: 'Secret mismatch' },
        },
      },
    },
    '/inbox/conversations': {
      get: {
        summary: 'List conversations',
        parameters: [
          {
            in: 'query',
            name: 'status',
            schema: { type: 'string', enum: ['open', 'closed'] },
          },
          {
            in: 'query',
            name: 'q',
            schema: { type: 'string' },
          },
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
          },
          {
            in: 'query',
            name: 'pageSize',
            schema: { type: 'integer', default: 20 },
          },
        ],
        responses: {
          '200': {
            description: 'Conversation list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { type: 'object' } },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        pageSize: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/inbox/conversations/{id}/messages': {
      get: {
        summary: 'List messages for a conversation',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Message list',
          },
          '404': {
            description: 'Conversation not found',
          },
        },
      },
    },
    '/inbox/conversations/{id}/reply': {
      post: {
        summary: 'Reply to a conversation',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                },
                required: ['text'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Reply sent successfully' },
          '400': { description: 'Invalid payload' },
          '404': { description: 'Conversation not found' },
        },
      },
    },
  },
};
