// dao/Jugadores.js: definir las funciones de acceso a datos de la tabla jugadores
import db from '../config/db.js';
// objeto jugador: 
const Jugador = {
    // Función para obtener todos los jugadores 
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT * FROM jugadores 
        `);
        return rows;
    },
     // Función para obtener todos los jugadores junto con sus estadísticas
    getAllWithStats: async () => {
        const [rows] = await db.query(`
            SELECT j.*, e.partidos, e.goles, e.asistencias, e.tarjetas_amarillas, e.tarjetas_rojas
            FROM jugadores j
            LEFT JOIN estadisticas e ON j.id = e.jugador_id
        `);
        return rows;
    }
};
// Exportar el objeto jugador para que pueda ser utilizado en otras partes de la aplicación
export default Jugador;