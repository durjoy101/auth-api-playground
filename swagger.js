// OpenAPI 3 spec for the Auth API Playground.
// Defines the 4 auth schemes so Swagger UI shows an "Authorize" button
// for each, letting testers call protected endpoints from the browser.

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Auth API Playground",
    version: "1.0.0",
    description:
      "Test 4 authentication methods: Basic, API Key, JWT Bearer, OAuth2 password. " +
      "Test user: tester / test123. API key: secret-key-123.",
  },
  components: {
    securitySchemes: {
      basicAuth: { type: "http", scheme: "basic" },
      apiKeyAuth: { type: "apiKey", in: "header", name: "X-API-Key" },
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      oauth2: {
        type: "oauth2",
        flows: {
          password: {
            tokenUrl: "/oauth/token",
            scopes: {},
          },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        summary: "Health check",
        responses: { 200: { description: "Server is running" } },
      },
    },
    "/public": {
      get: {
        summary: "Open endpoint (no auth)",
        responses: { 200: { description: "Public data" } },
      },
    },
    "/basic": {
      get: {
        summary: "Basic Auth protected",
        security: [{ basicAuth: [] }],
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" } },
      },
      post: {
        summary: "Basic Auth protected (echoes body)",
        security: [{ basicAuth: [] }],
        requestBody: {
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" } },
      },
    },
    "/apikey": {
      get: {
        summary: "API Key protected",
        security: [{ apiKeyAuth: [] }],
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" } },
      },
      post: {
        summary: "API Key protected (echoes body)",
        security: [{ apiKeyAuth: [] }],
        requestBody: {
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" } },
      },
    },
    "/login": {
      post: {
        summary: "Login -> JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "tester" },
                  password: { type: "string", example: "test123" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Returns token" }, 401: { description: "Invalid credentials" } },
      },
    },
    "/jwt": {
      get: {
        summary: "JWT Bearer protected",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" } },
      },
      post: {
        summary: "JWT Bearer protected (echoes body)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" } },
      },
    },
    "/oauth/token": {
      post: {
        summary: "OAuth2 password grant -> token",
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                properties: {
                  grant_type: { type: "string", example: "password" },
                  username: { type: "string", example: "tester" },
                  password: { type: "string", example: "test123" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Returns access_token" }, 401: { description: "invalid_grant" } },
      },
    },
    "/oauth/me": {
      get: {
        summary: "OAuth2 protected",
        security: [{ oauth2: [] }],
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" } },
      },
      post: {
        summary: "OAuth2 protected (echoes body)",
        security: [{ oauth2: [] }],
        requestBody: {
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" } },
      },
    },
  },
};

module.exports = { spec };
