-- Schéma validé dans le contrat (README.md) : ne pas modifier sans prévenir l'autre.
CREATE TABLE adresse (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero_rue VARCHAR(10) NOT NULL,
  nom_rue VARCHAR(255) NOT NULL,
  ville VARCHAR(100) NOT NULL,
  code_postal VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
