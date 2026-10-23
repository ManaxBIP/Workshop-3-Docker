const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/admin/adresses : lister les adresses
router.get('/adresses', async (req, res) => {
  // TODO (Personne A) : SELECT * FROM adresse
  res.status(501).json({ error: 'À implémenter' });
});

// POST /api/admin/adresses : créer une adresse
router.post('/adresses', async (req, res) => {
  // TODO (Personne A) :
  //  - récupérer { numero_rue, nom_rue, ville, code_postal } dans req.body
  //  - renvoyer 400 si un champ manque
  //  - INSERT INTO adresse ... (requête préparée avec des ?)
  //  - renvoyer 201 avec l'adresse créée (id compris)
  //  - try/catch -> 500 en cas d'erreur SQL
  res.status(501).json({ error: 'À implémenter' });
});

module.exports = router;
