const router = require('express').Router();

const produto = require('../controllers/produtoController');
const autenticar = require('../middlewares/auth');

// Todas as rotas abaixo exigem autenticação JWT
router.use(autenticar);

router.get('/', produto.listar);
router.get('/:id', produto.buscarPorId);
router.post('/', produto.criar);
router.put('/:id', produto.atualizar);
router.delete('/:id', produto.deletar);

module.exports = router;
