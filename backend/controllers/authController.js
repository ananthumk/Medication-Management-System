const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

exports.signup = (req, res) => {
  const { username, password, role } = req.body;

  const hash = bcrypt.hashSync(password, 8);
  const stmt = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;

  db.run(stmt, [username, hash, role], function (err) {
    if (err) return res.status(400).json({ error: "User already exists." });
    res.json({ id: this.lastID, username, role });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });
};
