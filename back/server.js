const express = require("express");
const cors = require("cors");
require("dotenv").config();

const usuariosRoutes = require("./routes/usuarios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", mensagem: "Back MarketMind funcionando" });
});

app.use("/usuarios", usuariosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Back rodando em http://localhost:${PORT}`);
});

const negociosRoutes = require("./routes/negocios");

app.use("/negocios", negociosRoutes);