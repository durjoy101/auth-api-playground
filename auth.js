// Auth middlewares. Each checks one auth method and either calls next()
// or responds 401.

const jwt = require("jsonwebtoken");
const { users } = require("./data");

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

// 1. Basic Auth: Authorization: Basic base64(username:password)
function basicAuth(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) {
    return res.status(401).json({ error: "Missing Basic auth header" });
  }

  const base64 = header.slice("Basic ".length);
  const decoded = Buffer.from(base64, "base64").toString("utf8");
  const sep = decoded.indexOf(":");
  const username = decoded.slice(0, sep);
  const password = decoded.slice(sep + 1);

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.user = { username: user.username };
  next();
}

// 2. API Key: X-API-Key header checked against env API_KEY
function apiKeyAuth(req, res, next) {
  const key = req.headers["x-api-key"];
  const expected = process.env.API_KEY || "secret-key-123";

  if (!key) {
    return res.status(401).json({ error: "Missing X-API-Key header" });
  }
  if (key !== expected) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  next();
}

// Helper: verify username/password, return user or null
function verifyCredentials(username, password) {
  return (
    users.find((u) => u.username === username && u.password === password) || null
  );
}

// Helper: sign a JWT for a user
function signToken(username) {
  return jwt.sign({ sub: username }, JWT_SECRET, { expiresIn: "1h" });
}

// 3. JWT Bearer: Authorization: Bearer <token>
function jwtAuth(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Bearer token" });
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { username: payload.sub };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = {
  basicAuth,
  apiKeyAuth,
  jwtAuth,
  signToken,
  verifyCredentials,
};
