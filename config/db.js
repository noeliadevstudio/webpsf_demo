// // config/db.js para configurar la conexión a la base de datos MySQL utilizando mysql2/promise y dotenv para cargar las variables de entorno
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const dbUrl = new URL(process.env.DATABASE_URL);
//variable para controlar cuando la app esta en local o en despliegue (para base de datos activar ssl)
const production = process.env.NODE_ENV === "production";

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
 ...(production && {
        ssl: {
            rejectUnauthorized: false
        }
  })
});

export default pool;