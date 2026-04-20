// routes/index.js: definir las rutas principales de la aplicación, incluyendo la ruta para la plantilla y la ruta de inicio
import express from 'express';
const router = express.Router();
// Importar el controlador de jugadores para manejar la ruta de la plantilla
import jugadorController from '../controllers/jugadorController.js';

// la ruta de la plantilla
router.get('/plantilla', jugadorController.getPlantilla);

// Ruta de Home
router.get('/', (req, res) => {
    res.render('index', { title: 'Inicio - PSF' });
});

export default router;