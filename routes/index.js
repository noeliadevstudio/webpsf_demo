import express from 'express';
const router = express.Router();
import jugadorController from '../controllers/jugadorController.js';

// la ruta de la plantilla
router.get('/plantilla', jugadorController.getPlantilla);

// Ruta de Home
router.get('/', (req, res) => {
    res.render('index', { title: 'Inicio - PSF' });
});

export default router;