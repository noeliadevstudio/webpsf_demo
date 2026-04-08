import db from '../config/db.js';

const Jugador = {
    // Función para obtener todos los jugadores con sus estadísticas
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT * FROM jugadores 
        `);
        return rows;
    }
};

export default Jugador;