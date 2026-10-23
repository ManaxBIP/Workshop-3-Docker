const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/users/adresses
router.get("/adresses", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM adresse ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/users/adresses/:id
router.get("/adresses/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Identifiant invalide" });
  }

  try {
    const [rows] = await pool.execute("SELECT * FROM adresse WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Adresse introuvable" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
