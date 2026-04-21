// controllers/jugadorController.js: definir el controlador para manejar las solicitudes relacionadas con los jugadores, incluyendo la función para obtener la plantilla completa con estadísticas
import Jugador from '../dao/Jugadores.js';

// Función para obtener la plantilla completa con estadísticas y renderizar la vista correspondiente
export const getPlantilla = async (req, res) => {
    try {  
        const jugadores = await Jugador.getAllConEstadisticas();
        res.render('players', { jugadores });
    } catch (error) {
        console.error("Error en el controlador de jugadores:", error);
        res.status(500).send("Error al cargar la plantilla");
    }
};
// Exportar el controlador para que pueda ser utilizado en las rutas
const jugadorController = { getPlantilla };
export default jugadorController;