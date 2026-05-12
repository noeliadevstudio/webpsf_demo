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
import Partido from '../dao/Partidos.js';

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
router.post('/admin/foto', authMiddleware.ensureAdmin, adminController.updateFoto);
router.post('/admin/partidos', authMiddleware.ensureAdmin, adminController.addPartido);
router.post('/admin/partidos/actualizar', authMiddleware.ensureAdmin, adminController.updatePartido);
router.post('/admin/partidos/borrar', authMiddleware.ensureAdmin, adminController.deletePartido);

// Ruta de Home
router.get('/', async (req, res) => {
    try {
        const ranking = await Voto.getRanking();
        const partidos = await Partido.getAll();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const proximosPartidos = partidos
            .filter(partido => {
                if (!partido.fecha) return false;
                const fechaPartido = new Date(partido.fecha);
                fechaPartido.setHours(0, 0, 0, 0);
                return fechaPartido >= today;
            })
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        res.render('index', { title: 'Inicio - PSF', ranking, user: req.session.user, partidos: proximosPartidos });
    } catch (error) {
        console.error("Error al cargar el ranking:", error);
        res.render('index', { title: 'Inicio - PSF', ranking: [], user: req.session.user, partidos: [] });
    }
});

export default router;