const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    mensagem: "Chat IA MarketMind funcionando"
  });
});

app.get("/teste-banco", async (req, res) => {
  try {
    const [resultado] = await db.query("SELECT 1 AS conectado");
    res.json({
      status: "ok",
      banco: resultado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: "Erro ao conectar no banco"
    });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { mensagem, usuario_id } = req.body;

    if (!mensagem) {
      return res.status(400).json({
        erro: "Mensagem é obrigatória"
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Você é o assistente da MarketMind. Responda de forma simples e ajude o usuário com dúvidas sobre marketing, vendas, relatórios e empresas."
        },
        {
          role: "user",
          content: mensagem
        }
      ]
    });

    const resposta = completion.choices[0].message.content;

    await db.query(
      "INSERT INTO conversas (usuario_id, pergunta, resposta) VALUES (?, ?, ?)",
      [usuario_id || "visitante", mensagem, resposta]
    );

    res.json({
      resposta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: "Erro ao processar mensagem"
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor da IA rodando em http://localhost:${PORT}`);
});