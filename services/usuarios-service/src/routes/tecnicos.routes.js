const express = require('express');
const tecnicosController = require('../controllers/tecnicos.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(verifyToken);

router.get('/', tecnicosController.listarTecnicos);
router.get('/nombre/:nombre', tecnicosController.obtenerTecnicoPorNombre);
router.get('/:id', tecnicosController.obtenerTecnicoPorId);
router.patch('/:id/carga', tecnicosController.actualizarCargaTecnico);

module.exports = router;
