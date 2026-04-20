// // config/db.js para configurar la conexión a la base de datos MySQL utilizando mysql2/promise y dotenv para cargar las variables de entorno
// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// // Cargar las variables del archivo .env
// dotenv.config();
// // variables de entorno descritas en el archivo .env: 
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// export default pool;

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;