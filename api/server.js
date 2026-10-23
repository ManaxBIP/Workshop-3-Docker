const express = require("express");
const adminRoutes = require("./src/routes/admin");
const usersRoutes = require("./src/routes/users");

const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/admin", adminRoutes);
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API démarrée sur le port ${PORT}`));
