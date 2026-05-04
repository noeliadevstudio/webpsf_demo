// controllers/jugadorController.js: definir el controlador para manejar las solicitudes relacionadas con los jugadores, incluyendo la función para obtener la plantilla completa con estadísticas
import Jugador from '../dao/Jugadores.js';
import Voto from '../dao/Votos.js';

// Función para obtener la plantilla completa con estadísticas y renderizar la vista correspondiente
export const getPlantilla = async (req, res) => {
    try {  
        const jugadores = await Jugador.getAllConEstadisticas();
        res.render('players', { jugadores, user: req.session.user });
    } catch (error) {
        console.error("Error en el controlador de jugadores:", error);
        res.status(500).send("Error al cargar la plantilla");
    }
};

// Función para votar por un jugador
export const votar = async (req, res) => {
    try {
        console.log('POST /votar body:', req.body);
        const { id_jugador } = req.body;
        if (!id_jugador) {
            return res.status(400).json({ error: 'Falta id_jugador en la solicitud.' });
        }
        const id_usuario = req.session?.user?.id;
        console.log('Votando: usuario', id_usuario, 'jugador', id_jugador);

        if (!id_usuario) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }

        // Verificar si ya votó esta semana
        const votosSemana = await Voto.getVotosSemana(id_usuario);
        console.log('Votos esta semana:', votosSemana.length);
        if (votosSemana.length > 0) {
            return res.status(400).json({ error: 'Ya has votado esta semana.' });
        }

        // Crear el voto
        await Voto.create({ id_usuario, id_jugador });
        console.log('Voto creado');

        // Incrementar estrellas del jugador
        await Jugador.incrementarEstrellas(id_jugador);
        console.log('Estrellas incrementadas');

        res.json({ success: true });
    } catch (error) {
        console.error("Error al votar:", error);
        res.status(500).json({ error: error.toString() || 'Error al votar.' });
    }
};

// Exportar el controlador para que pueda ser utilizado en las rutas
const jugadorController = { getPlantilla, votar };
export default jugadorController;