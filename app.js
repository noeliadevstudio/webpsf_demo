import 'dotenv/config'; // Carga el .env 
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js'; 
import Usuario from './dao/Usuarios.js';

const app = express();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'psf-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2
    }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use('/', indexRouter);

// Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT,  "0.0.0.0",() => {
    console.log(`Servidor de la Web PSF corriendo en http://localhost:${PORT}`);
});