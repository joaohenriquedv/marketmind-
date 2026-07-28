const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/criar", async (req, res) => {
  try {
    const {
      usuario_id,
      nome,
      segmento,
      localizacao,
      receita_mensal,
      custos_mensais,
      funcionarios,
      anos_mercado,
      publico_alvo,
      concorrentes
    } = req.body;

    if (!usuario_id || !nome) {
      return res.status(400).json({
        erro: "Usuário e nome do negócio são obrigatórios."
      });
    }

    const [resultado] = await db.query(
      `
      INSERT INTO negocios
      (
        usuario_id,
        nome,
        segmento,
        localizacao,
        receita_mensal,
        custos_mensais,
        funcionarios,
        anos_mercado,
        publico_alvo,
        concorrentes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        usuario_id,
        nome,
        segmento,
        localizacao,
        receita_mensal || 0,
        custos_mensais || 0,
        funcionarios || 0,
        anos_mercado || 0,
        publico_alvo || "",
        concorrentes || ""
      ]
    );

    res.status(201).json({
      sucesso: true,
      mensagem: "Negócio cadastrado com sucesso.",
      negocio: {
        id: resultado.insertId,
        nome
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      erro: "Erro ao cadastrar negócio."
    });
  }
});

router.get("/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const [negocios] = await db.query(
      "SELECT * FROM negocios WHERE usuario_id = ?",
      [usuarioId]
    );

    res.json(negocios);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      erro: "Erro ao buscar negócios."
    });
  }
});

module.exports = router;