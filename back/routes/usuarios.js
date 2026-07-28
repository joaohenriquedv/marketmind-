const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/cadastrar", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: "Preencha nome, email e senha."
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        erro: "A senha deve ter pelo menos 6 caracteres."
      });
    }

    const [existe] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existe.length > 0) {
      return res.status(400).json({
        erro: "E-mail já cadastrado."
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [resultado] = await db.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, senhaHash]
    );

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: {
        id: resultado.insertId,
        nome,
        email
      }
    });
  } catch (error) {
    console.log("Erro ao cadastrar:", error);

    res.status(500).json({
      erro: "Erro interno ao cadastrar usuário."
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: "Preencha email e senha."
      });
    }

    const [usuarios] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        erro: "Email ou senha inválidos."
      });
    }

    const usuario = usuarios[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        erro: "Email ou senha inválidos."
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (error) {
    console.log("Erro ao fazer login:", error);

    res.status(500).json({
      erro: "Erro interno ao fazer login."
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const [usuarios] = await db.query(
      "SELECT id, nome, email, criado_em FROM usuarios"
    );

    res.json(usuarios);
  } catch (error) {
    console.log("Erro ao listar usuários:", error);

    res.status(500).json({
      erro: "Erro ao listar usuários."
    });
  }
});

module.exports = router;

