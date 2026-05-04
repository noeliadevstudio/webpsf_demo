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
    getAllConEstadisticas: async () => {
        const [rows] = await db.query(`
            SELECT j.*, e.partidos, e.goles, e.asistencias, e.tarjetas_amarillas, e.tarjetas_rojas, COALESCE(e.cant_estrellas, 0) AS cant_estrellas
            FROM jugadores j
            LEFT JOIN estadisticas e ON j.id = e.jugador_id
        `);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM jugadores WHERE id = ?', [id]);
        return rows[0];
    },
    create: async ({ nombre, apellido, mote, dorsal, posicion, URL_foto, historico }) => {
        const [result] = await db.query(
            `INSERT INTO jugadores (nombre, apellido, mote, dorsal, posicion, URL_foto, historico)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido || null, mote || null, dorsal || null, posicion || null, URL_foto || null, historico || null]
        );
        return result.insertId;
    },
    upsertEstadisticas: async ({ jugador_id, partidos, goles, asistencias, tarjetas_amarillas, tarjetas_rojas, cant_estrellas }) => {
        await db.query(
            `INSERT INTO estadisticas (jugador_id, partidos, goles, asistencias, tarjetas_amarillas, tarjetas_rojas, cant_estrellas)
                VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                partidos = VALUES(partidos),
                goles = VALUES(goles),
                asistencias = VALUES(asistencias),
                tarjetas_amarillas = VALUES(tarjetas_amarillas),
                tarjetas_rojas = VALUES(tarjetas_rojas),
                cant_estrellas = VALUES(cant_estrellas)`,
            [jugador_id, partidos || 0, goles || 0, asistencias || 0, tarjetas_amarillas || 0, tarjetas_rojas || 0, cant_estrellas || 0]
        );
    },
    // Función para incrementar cant_estrellas
    incrementarEstrellas: async (id) => {
        const [result] = await db.query(
            'UPDATE estadisticas SET cant_estrellas = COALESCE(cant_estrellas, 0) + 1 WHERE jugador_id = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            await db.query(
                'INSERT INTO estadisticas (jugador_id, cant_estrellas) VALUES (?, 1)',
                [id]
            );
        }
    }
};
// Exportar el objeto jugador para que pueda ser utilizado en otras partes de la aplicación
export default Jugador;