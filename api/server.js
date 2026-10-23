const express = require('express');
const adminRoutes = require('./src/routes/admin');
const usersRoutes = require('./src/routes/users');

const app = express();
app.use(express.json());

// Vérifie que l'API tourne (utile pour tester le reverse-proxy)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes séparées selon le front qui appelle
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API démarrée sur le port ${PORT}`));
