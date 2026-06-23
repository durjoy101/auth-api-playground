# Auth API Playground

A simple testing project: an Express API server that demonstrates **4 different
authentication methods**. Deployed to a free host so anyone can hit the endpoints
from their own projects to learn/test how each auth type works.

## Goal

- Expose a small set of API endpoints, each protected by a different auth method.
- Keep it dead simple — no database, no build step, minimal dependencies.
- Deploy to a free server (Render) with a public URL.
- Provide interactive Swagger docs so testers can try endpoints in the browser.

## Non-Goals

- Not production-grade security. This is a learning/testing playground.
- No persistent storage — users are hardcoded in memory.
- No user signup/registration that survives a restart.

## Tech Stack

| Concern      | Choice                          | Why                                  |
|--------------|---------------------------------|--------------------------------------|
| Runtime      | Node.js 22 LTS                  | Simple, ubiquitous; pin via `.nvmrc` + `engines` |
| Framework    | Express                         | Minimal, well-known                  |
| Data         | In-memory JS array (no DB)      | Zero setup; fine for a test project  |
| Auth - JWT   | `jsonwebtoken`                  | Standard JWT sign/verify             |
| Passwords    | `bcryptjs` (optional)           | Hash demo passwords; or plain for simplicity |
| Docs         | `swagger-ui-express`            | Browser UI to test endpoints         |
| Deploy       | Render (free tier)              | Auto-deploy from GitHub, public URL  |

## Auth Methods to Implement

1. **Basic Auth** — `Authorization: Basic base64(user:pass)` header.
2. **API Key** — `X-API-Key` header checked against a known key.
3. **JWT Bearer** — `POST /login` returns a token; protected routes need
   `Authorization: Bearer <token>`.
4. **OAuth2 Password Flow** — Swagger-compatible password grant so the docs page
   gets an "Authorize" button. (Reuses the JWT logic underneath.)

## Planned Endpoints

| Method | Path                  | Auth        | Purpose                          |
|--------|-----------------------|-------------|----------------------------------|
| GET    | `/`                   | none        | Health check / hello             |
| GET    | `/public`             | none        | Open endpoint, no auth           |
| GET    | `/basic`              | Basic       | Returns user if Basic auth valid |
| GET    | `/apikey`             | API Key     | Returns ok if key valid          |
| POST   | `/login`              | none        | Body: user+pass -> JWT token     |
| GET    | `/jwt`                | JWT Bearer  | Protected; returns token payload |
| POST   | `/oauth/token`        | none        | OAuth2 password grant -> token   |
| GET    | `/oauth/me`           | OAuth2 JWT  | Protected via OAuth2 flow        |
| GET    | `/docs`               | none        | Swagger UI                       |

## Hardcoded Test Data

```
users = [
  { username: "tester", password: "test123" }
]
API_KEY = "secret-key-123"
JWT_SECRET = from env var, fallback to a dev default
```

## Project Structure (target)

```
/
├── server.js          # Express app + all routes (keep it in one file at first)
├── auth.js            # middleware: basicAuth, apiKeyAuth, jwtAuth
├── swagger.js         # swagger spec / setup
├── package.json
├── .env.example       # JWT_SECRET, PORT, API_KEY
├── .gitignore         # node_modules, .env
└── README.md          # how to run + how testers use each endpoint
```

Start with everything in `server.js`; split into `auth.js` / `swagger.js` only
once it grows.

## Run Locally

```
nvm use 22          # project pins Node 22 LTS (see .nvmrc)
npm install
npm start          # node server.js, listens on PORT (default 3000)
# open http://localhost:3000/docs
```

## Deploy (Render free tier)

1. Push repo to GitHub.
2. Render -> New Web Service -> connect repo.
3. Build command: `npm install`  | Start command: `npm start`.
4. Set env vars: `JWT_SECRET`, `API_KEY`.
5. Render gives a public `https://<name>.onrender.com` URL.
   Note: free tier sleeps when idle; first request after sleep is slow.

## Build Steps (review gate after each)

Each step is a stopping point. User reviews before next step starts.

### Step 0 — Git init
`git init`, add `.gitignore` (node_modules, .env), first commit.
**Review:** repo initialized, nothing secret tracked.

### Step 1 — Scaffold
`npm init`, install express, create `.env.example`, `.nvmrc` (Node 22),
`package.json` with `engines` + `start` script.
**Review:** project skeleton + deps list.

### Step 2 — Base server
`server.js` with `GET /` health + `GET /public`. In-memory users array.
**Review:** server boots, two open routes work.

### Step 3 — Basic Auth
`basicAuth` middleware + `GET /basic`.
**Review:** valid creds pass, bad creds -> 401.

### Step 4 — API Key
`apiKeyAuth` middleware + `GET /apikey`.
**Review:** right key passes, wrong -> 401.

### Step 5 — JWT
`POST /login` -> token. `jwtAuth` middleware + `GET /jwt`.
**Review:** login returns token, token unlocks `/jwt`.

### Step 6 — OAuth2 password flow
`POST /oauth/token` + `GET /oauth/me`.
**Review:** password grant returns token, protects route.

### Step 7 — Swagger docs
`swagger-ui-express` at `/docs`, all routes + auth buttons.
**Review:** `/docs` page, try each endpoint in browser.

### Step 8 — README
Run instructions + curl example per auth type.
**Review:** docs clear.

### Step 9 — Deploy
Push GitHub -> Render free tier -> public URL. Verify live.
**Review:** public URL works.

## Conventions

- CommonJS (`require`), not ESM — simplest for a small Node project.
- Return JSON everywhere. On auth failure return `401` with `{ error: "..." }`.
- No secrets committed. Real values via env vars; `.env` is gitignored.
