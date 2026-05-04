// routes/index.js: definir las rutas principales de la aplicación, incluyendo la ruta para la plantilla y la ruta de inicio
import express from 'express';
const router = express.Router();
// Importar el controlador de jugadores para manejar la ruta de la plantilla
import jugadorController from '../controllers/jugadorController.js';
// Importar el controlador de autenticación para manejar las rutas de login, registro y logout
import authController from '../controllers/authController.js';
import adminController from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import Voto from '../dao/Votos.js';

router.get('/plantilla', jugadorController.getPlantilla);
router.get('/votar', (req, res) => {
    res.redirect('/plantilla');
});
router.post('/votar', authMiddleware.ensureAuthenticated, jugadorController.votar);
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/register', authController.showRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

router.get('/admin', authMiddleware.ensureAdmin, adminController.getAdminPanel);
router.post('/admin/jugadores', authMiddleware.ensureAdmin, adminController.addJugador);
router.post('/admin/estadisticas', authMiddleware.ensureAdmin, adminController.updateEstadisticas);
router.post('/admin/partidos', authMiddleware.ensureAdmin, adminController.addPartido);

// Ruta de Home
router.get('/', async (req, res) => {
    try {
        const ranking = await Voto.getRanking();
        res.render('index', { title: 'Inicio - PSF', ranking, user: req.session.user });
    } catch (error) {
        console.error("Error al cargar el ranking:", error);
        res.render('index', { title: 'Inicio - PSF', ranking: [], user: req.session.user });
    }
});

export default router;