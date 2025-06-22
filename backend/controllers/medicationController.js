const db = require("../models/db");

exports.getMedications = (req, res) => {
  db.all("SELECT * FROM medications WHERE userId = ?", [req.user.id], (err, rows) => {
    res.json(rows);
  });
};

exports.addMedication = (req, res) => {
  const { name, dosage, frequency } = req.body;

  db.run(
    `INSERT INTO medications (userId, name, dosage, frequency) VALUES (?, ?, ?, ?)`,
    [req.user.id, name, dosage, frequency],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, dosage, frequency });
    }
  );
};

exports.markTaken = (req, res) => {
  const { id } = req.params;
  const today = new Date().toISOString().split("T")[0];

  db.get("SELECT takenDates FROM medications WHERE id = ?", [id], (err, row) => {
    if (!row) return res.status(404).json({ error: "Medication not found" });

    const dates = JSON.parse(row.takenDates || "[]");
    if (!dates.includes(today)) dates.push(today);

    db.run("UPDATE medications SET takenDates = ? WHERE id = ?", [JSON.stringify(dates), id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Marked as taken" });
    });
  });
};


exports.deleteMedication = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  db.run(
    "DELETE FROM medications WHERE id = ? AND user_id = ?",
    [id, userId],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });
      if (this.changes === 0) return res.status(404).json({ error: "Medication not found" });
      res.json({ message: "Medication deleted" });
    }
  );
};

exports.updateMedication = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { name, dosage, frequency } = req.body;
  db.run(
    "UPDATE medications SET name = ?, dosage = ?, frequency = ? WHERE id = ? AND user_id = ?",
    [name, dosage, frequency, id, userId],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });
      if (this.changes === 0) return res.status(404).json({ error: "Medication not found or no changes" });
      res.json({ message: "Medication updated" });
    }
  );
};