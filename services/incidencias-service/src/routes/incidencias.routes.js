const express = require('express');
const incidenciasController = require('../controllers/incidencias.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const {
  validateRegistrarIncidencia,
  validateActualizarIncidencia,
} = require('../middleware/validation.middleware');

const router = express.Router();

router.use(verifyToken);

router.get('/', incidenciasController.listarIncidencias);
router.post('/', validateRegistrarIncidencia, incidenciasController.registrarIncidencia);
router.get('/mias', incidenciasController.listarMisIncidencias);
router.get('/:id/historial', incidenciasController.obtenerHistorialIncidencia);
router.get('/:id', incidenciasController.obtenerIncidenciaPorId);
router.patch('/:id', validateActualizarIncidencia, incidenciasController.actualizarIncidencia);

module.exports = router;
