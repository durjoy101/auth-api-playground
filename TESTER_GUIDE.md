# Auth API Playground — Tester Guide

A live API to test 4 authentication methods. Hit it from Postman, curl, or your
own app.

**Base URL:** `<BASE_URL>`  *(e.g. https://your-app.onrender.com)*

> Note: free hosting sleeps when idle. First request after a pause may take
> ~30–50 seconds to wake up. Retry once if the first call is slow.

## Test credentials

| Thing    | Value             |
|----------|-------------------|
| Username | `tester`          |
| Password | `test123`         |
| API key  | `secret-key-123`  |

## Easiest way: open the docs in a browser

Go to **`<BASE_URL>/docs`** — interactive Swagger UI.

1. Click green **Authorize** (top right), fill the scheme you want.
2. Pick any endpoint → **Try it out** → **Execute** → see the live response.

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
| GET / POST | `/oauth/me`     | OAuth2      |

POST variants echo your JSON body back so you can confirm the request reached
the protected handler.

## Postman setup

Make an Environment variable so you don't retype the URL:

| Variable   | Value       |
|------------|-------------|
| `base_url` | `<BASE_URL>`|

Then write request URLs as `{{base_url}}/basic`, etc.

## 1. Basic Auth

Postman: Authorization tab → **Basic Auth** → `tester` / `test123`.

```bash
curl -u tester:test123 <BASE_URL>/basic
```

## 2. API Key

Postman: Headers tab → key `X-API-Key`, value `secret-key-123`.

```bash
curl -H "X-API-Key: secret-key-123" <BASE_URL>/apikey
```

## 3. JWT Bearer

Step 1 — log in to get a token (valid 1 hour):

```bash
curl -X POST <BASE_URL>/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","password":"test123"}'
```

Step 2 — use the token:

```bash
curl <BASE_URL>/jwt -H "Authorization: Bearer <TOKEN>"
```

Postman: Authorization tab → **Bearer Token** → paste token.

## 4. OAuth2 (password grant)

Token endpoint uses **form-encoded** body (in Postman:
Body → x-www-form-urlencoded).

```bash
curl -X POST <BASE_URL>/oauth/token \
  -d "grant_type=password&username=tester&password=test123"

curl <BASE_URL>/oauth/me -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## What "success" looks like

- Correct auth → `200` with a JSON `message`.
- Missing/wrong auth → `401` with `{ "error": "..." }`.
- OAuth2 wrong grant_type → `400`.

That's it — try each method and watch the 200 vs 401 responses.
