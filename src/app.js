const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
  res.json({ status: 'API online' });
});

// Rotas da API
app.use('/auth', require('./routes/authRoutes'));
app.use('/produtos', require('./routes/produtoRoutes'));

module.exports = app;