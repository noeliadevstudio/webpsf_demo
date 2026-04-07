const db = require('../config/db');

const Jugador = {
    // Función para obtener todos los jugadores con sus estadísticas
    getAllWithStats: async () => {
        const [rows] = await db.query(`
            SELECT j.*, e.goles, e.asistencias, e.amarillas, e.rojas, e.cant_estrellas
            FROM jugadores j
            LEFT JOIN estadisticas e ON j.id = e.jugador_id
        `);
        return rows;
    }
};

module.exports = Jugador;