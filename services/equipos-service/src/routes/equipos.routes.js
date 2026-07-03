const express = require('express');
const equiposController = require('../controllers/equipos.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(verifyToken);

router.get('/', equiposController.listarEquipos);
router.get('/:codigo/validar', equiposController.validarEquipo);
router.get('/:codigo', equiposController.obtenerEquipoPorCodigo);

module.exports = router;
