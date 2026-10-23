const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/admin/adresses
router.get("/adresses", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM adresse ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/admin/adresses
router.post("/adresses", async (req, res) => {
  const entries = ["numero_rue", "nom_rue", "ville", "code_postal"].map(
    (field) => {
      const value = req.body?.[field];
      const isValid = typeof value === "string" || typeof value === "number";
      return [field, isValid ? String(value).trim() : ""];
    },
  );

  const missing = entries.find(([, text]) => text === "");
  if (missing) {
    return res.status(400).json({ error: `Champ manquant : ${missing[0]}` });
  }
  const address = Object.fromEntries(entries);

  try {
    const [result] = await pool.execute(
      `INSERT INTO adresse (numero_rue, nom_rue, ville, code_postal) VALUES (?, ?, ?, ?)`,
      [address.numero_rue, address.nom_rue, address.ville, address.code_postal],
    );
    res.status(201).json({ id: result.insertId, ...address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
