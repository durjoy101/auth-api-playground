# Auth API Playground

A simple Express API that demonstrates **4 authentication methods**. Use it to
test how each auth type works from your own project (Postman, curl, fetch, etc.).

No database — the test user is hardcoded in memory.

## Test credentials

| Thing    | Value             |
|----------|-------------------|
| Username | `tester`          |
| Password | `test123`         |
| API key  | `secret-key-123`  |

## Run locally

```bash
nvm use 22        # project pins Node 22 (see .nvmrc)
npm install
npm start         # http://localhost:3000
```

Open interactive docs: **http://localhost:3000/docs** (Swagger UI — click
**Authorize**, then **Try it out** on any endpoint).

## Endpoints

| Method     | Path            | Auth        |
|------------|-----------------|-------------|
| GET        | `/`             | none        |
| GET        | `/public`       | none        |
| GET / POST | `/basic`        | Basic       |
| GET / POST | `/apikey`       | API Key     |
| POST       | `/login`        | none        |
| GET / POST | `/jwt`          | JWT Bearer  |
| POST       | `/oauth/token`  | none        |
| GET / POST | `/oauth/me`     | OAuth2 JWT  |
| GET        | `/docs`         | none        |

The POST variants echo your JSON body back so you can confirm the request
reached the protected handler.

## 1. Basic Auth

`Authorization: Basic base64(username:password)` header.

```bash
curl -u tester:test123 http://localhost:3000/basic
```

## 2. API Key

`X-API-Key` header.

```bash
curl -H "X-API-Key: secret-key-123" http://localhost:3000/apikey
```

## 3. JWT Bearer

Log in to get a token (valid 1 hour), then send it as a Bearer token.

```bash
# get token
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","password":"test123"}'

# use token
curl http://localhost:3000/jwt \
  -H "Authorization: Bearer <TOKEN>"
```

## 4. OAuth2 (password grant)

Token endpoint expects **form-encoded** data, returns a standard OAuth2 token.

```bash
# get token
curl -X POST http://localhost:3000/oauth/token \
  -d "grant_type=password&username=tester&password=test123"

# use token
curl http://localhost:3000/oauth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Environment variables

Copy `.env.example` to `.env` and adjust if you want non-default values:

```
PORT=3000
JWT_SECRET=change-me-in-production
API_KEY=secret-key-123
```

## Notes

- In-memory data: users reset on restart. Not for production.
- This is a learning/testing playground, not hardened security.
