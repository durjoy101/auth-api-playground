// Auth middlewares. Each checks one auth method and either calls next()
// or responds 401.

const { users } = require("./data");

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

module.exports = { basicAuth };
