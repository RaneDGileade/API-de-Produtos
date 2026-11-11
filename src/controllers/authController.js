
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usuarios = db.collection('usuarios');

// CADASTRAR USUÁRIO
exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: 'nome, email e senha são obrigatórios'
      });
    }

    if (typeof senha !== 'string' || senha.length < 8) {
      return res.status(400).json({
        erro: 'A senha deve ter pelo menos 8 caracteres'
      });
    }

    const existe = await usuarios
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existe.empty) {
      return res.status(409).json({
        erro: 'Email já cadastrado'
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    await usuarios.add({
      nome,
      email,
      senha: hash
    });

    res.status(201).json({
      mensagem: 'Usuário criado'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      erro: 'Erro interno'
    });
  }
};

// FAZER LOGIN
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: 'email e senha são obrigatórios'
      });
    }

    const snap = await usuarios
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(401).json({
        erro: 'Credenciais inválidas'
      });
    }

    const doc = snap.docs[0];
    const usuario = doc.data();

    const ok = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!ok) {
      return res.status(401).json({
        erro: 'Credenciais inválidas'
      });
    }

    const token = jwt.sign(
      {
        id: doc.id,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      erro: 'Erro interno'
    });
  }
};
