// dao/Votos.js: definir las funciones de acceso a datos de la tabla votos
import db from '../config/db.js';

const Voto = {
    // Función para obtener votos de un usuario en la semana actual
    getVotosSemana: async (id_usuario) => {
        const [rows] = await db.query(`
            SELECT * FROM votos 
            WHERE id_usuario = ? AND YEARWEEK(fecha, 1) = YEARWEEK(CURDATE(), 1)
        `, [id_usuario]);
        return rows;
    },
    // Función para crear un voto
    create: async ({ id_usuario, id_jugador }) => {
        const today = new Date().toISOString().split('T')[0];
        const [result] = await db.query(
            'INSERT INTO votos (id_usuario, id_jugador, fecha) VALUES (?, ?, ?)',
            [id_usuario, id_jugador, today]
        );
        return result.insertId;
    },
    // Función para obtener el ranking de estrellas
    getRanking: async () => {
        const [rows] = await db.query(`
            SELECT j.nombre, j.apellido, e.cant_estrellas
            FROM jugadores j
            LEFT JOIN estadisticas e ON j.id = e.jugador_id
            ORDER BY e.cant_estrellas DESC
            LIMIT 10
        `);
        return rows;
    }
};

export default Voto;