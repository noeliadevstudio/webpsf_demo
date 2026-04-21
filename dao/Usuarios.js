import db from '../config/db.js';

const Usuario = {
    getByUsername: async (username) => {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        return rows[0];
    },
    create: async ({ username, nombre, contrasena }) => {
        try {
            const [result] = await db.query(
                'INSERT INTO usuarios (username, nombre, contrasena, rol) VALUES (?, ?, ?, ?)',
                [username, nombre, contrasena, 'user']
            );
            return result.insertId;
        } catch (error) {
            // Manejar error de clave duplicada para username
            if (error && error.code === 'ER_DUP_ENTRY') {
                throw new Error('DUPLICATE_USERNAME');
            }
            throw error;
        }
    },
    // Función para crear un usuario admin solo se utiliza en el script de admin.js
    createAdmin: async ({ username, nombre, contrasena }) => {
        const [result] = await db.query(
            'INSERT INTO usuarios (username, nombre, contrasena, rol) VALUES (?, ?, ?, ?)',
            [username, nombre, contrasena, 'admin']
        );
        return result.insertId;
    }
};

export default Usuario;
