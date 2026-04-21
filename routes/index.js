// routes/index.js: definir las rutas principales de la aplicación, incluyendo la ruta para la plantilla y la ruta de inicio
import express from 'express';
const router = express.Router();
// Importar el controlador de jugadores para manejar la ruta de la plantilla
import jugadorController from '../controllers/jugadorController.js';
// Importar el controlador de autenticación para manejar las rutas de login, registro y logout
import authController from '../controllers/authController.js';

router.get('/plantilla', jugadorController.getPlantilla);
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/register', authController.showRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

// Ruta de Home
router.get('/', (req, res) => {
    res.render('index', { title: 'Inicio - PSF' });
});

export default router;