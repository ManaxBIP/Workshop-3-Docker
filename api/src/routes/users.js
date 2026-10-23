const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/adresses", async (req, res) => {
  // TODO (Personne A) : SELECT * FROM adresse
  res.status(501).json({ error: "À implémenter" });
});

router.get("/adresses/:id", async (req, res) => {
  // TODO (Personne A) : SELECT ... WHERE id = ? -> 404 si introuvable
  res.status(501).json({ error: "À implémenter" });
});

module.exports = router;
