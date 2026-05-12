import db from '../config/db.js';

const Partido = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM partido ORDER BY fecha ASC');
        return rows;
    },

    create: async ({ fecha, rival, terminado = false, resultado = null }) => {
        const [result] = await db.query(
            'INSERT INTO partido (fecha, rival, terminado, resultado) VALUES (?, ?, ?, ?)',
            [fecha, rival, terminado ? 1 : 0, resultado || null]
        );
        return result.insertId;
    },

    update: async ({ id, fecha, rival, terminado, resultado }) => {
        const [result] = await db.query(
            'UPDATE partido SET fecha = ?, rival = ?, terminado = ?, resultado = ? WHERE id = ?',
            [fecha, rival, terminado ? 1 : 0, resultado || null, id]
        );
        return result.affectedRows > 0;
    },

    deleteById: async (id) => {
        const [result] = await db.query('DELETE FROM partido WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

export default Partido;
