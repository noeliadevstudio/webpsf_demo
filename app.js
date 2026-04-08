import 'dotenv/config'; // Carga el .env 
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js'; 

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// e plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Carpeta para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// CSS: 
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// el archivo de rutas
app.use('/', indexRouter); 

// Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de la Web PSF corriendo en http://localhost:${PORT}`);
});