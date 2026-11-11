
const db = require('../config/db');

const produtos = db.collection('produtos');

// GET /produtos - LISTAR TODOS
exports.listar = async (req, res) => {
  try {
    const snap = await produtos.get();

    res.json(
      snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
};

// GET /produtos/:id - BUSCAR POR ID
exports.buscarPorId = async (req, res) => {
  try {
    const doc = await produtos.doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({
        erro: 'Produto não encontrado'
      });
    }

    res.json({
      id: doc.id,
      ...doc.data()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
};

// POST /produtos - CRIAR PRODUTO
exports.criar = async (req, res) => {
  try {
    const { nome, descricao, preco, estoque } = req.body;

    if (
      typeof nome !== 'string' ||
      !nome.trim() ||
      typeof preco !== 'number' ||
      !Number.isFinite(preco)
    ) {
      return res.status(400).json({
        erro: 'nome e preco válidos são obrigatórios'
      });
    }

    if (
      preco < 0 ||
      (estoque !== undefined &&
        (!Number.isInteger(estoque) || estoque < 0))
    ) {
      return res.status(400).json({
        erro: 'preco e estoque devem ser valores válidos e não negativos'
      });
    }

    const novo = {
      nome: nome.trim(),
      descricao: descricao || null,
      preco,
      estoque: estoque ?? 0,
      criadoEm: new Date()
    };

    const ref = await produtos.add(novo);

    res.status(201).json({
      id: ref.id,
      ...novo
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
};

// PUT /produtos/:id - ATUALIZAR PRODUTO
exports.atualizar = async (req, res) => {
  try {
    const { nome, descricao, preco, estoque } = req.body;

    if (
      typeof nome !== 'string' ||
      !nome.trim() ||
      typeof preco !== 'number' ||
      !Number.isFinite(preco)
    ) {
      return res.status(400).json({
        erro: 'nome e preco válidos são obrigatórios'
      });
    }

    if (
      preco < 0 ||
      (estoque !== undefined &&
        (!Number.isInteger(estoque) || estoque < 0))
    ) {
      return res.status(400).json({
        erro: 'preco e estoque devem ser valores válidos e não negativos'
      });
    }

    const ref = produtos.doc(req.params.id);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({
        erro: 'Produto não encontrado'
      });
    }

    await ref.update({
      nome: nome.trim(),
      descricao: descricao || null,
      preco,
      estoque: estoque ?? 0
    });

    res.json({ mensagem: 'Produto atualizado' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
};

// DELETE /produtos/:id - DELETAR PRODUTO
exports.deletar = async (req, res) => {
  try {
    const ref = produtos.doc(req.params.id);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({
        erro: 'Produto não encontrado'
      });
    }

    await ref.delete();

    res.json({ mensagem: 'Produto removido' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
};
