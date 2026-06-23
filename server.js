require("dotenv").config();
const express = require("express");
const { users } = require("./data");
const {
  basicAuth,
  apiKeyAuth,
  jwtAuth,
  signToken,
  verifyCredentials,
} = require("./auth");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Auth API Playground is running" });
});

// Open endpoint, no auth required
app.get("/public", (req, res) => {
  res.json({ message: "This is a public endpoint. No auth needed." });
});

// Basic Auth protected
app.get("/basic", basicAuth, (req, res) => {
  res.json({ message: "Basic auth OK", user: req.user.username });
});

// Basic Auth protected POST - echoes the JSON body back
app.post("/basic", basicAuth, (req, res) => {
  res.json({
    message: "Basic auth OK (POST)",
    user: req.user.username,
    received: req.body,
  });
});

// API Key protected
app.get("/apikey", apiKeyAuth, (req, res) => {
  res.json({ message: "API key OK" });
});

// API Key protected POST - echoes the JSON body back
app.post("/apikey", apiKeyAuth, (req, res) => {
  res.json({ message: "API key OK (POST)", received: req.body });
});

// JWT login - body: { username, password } -> returns a token
app.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const user = verifyCredentials(username, password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({ token: signToken(user.username) });
});

// JWT Bearer protected
app.get("/jwt", jwtAuth, (req, res) => {
  res.json({ message: "JWT OK", user: req.user.username });
});

// JWT Bearer protected POST - echoes the JSON body back
app.post("/jwt", jwtAuth, (req, res) => {
  res.json({
    message: "JWT OK (POST)",
    user: req.user.username,
    received: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

module.exports = { app };
