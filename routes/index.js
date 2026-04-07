const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugadorController');

// Definimos la ruta de la plantilla
router.get('/plantilla', jugadorController.getPlantilla);

// Puedes añadir aquí la del home
router.get('/', (req, res) => res.render('index', { title: 'Inicio - PSF' }));

module.exports = router;