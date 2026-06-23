require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory user store (no DB). Resets on restart.
const users = [
  { username: "tester", password: "test123" },
];

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Auth API Playground is running" });
});

// Open endpoint, no auth required
app.get("/public", (req, res) => {
  res.json({ message: "This is a public endpoint. No auth needed." });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

module.exports = { app, users };
