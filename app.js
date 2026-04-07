const express = require('express');
const app = express();
const path = require('path');


// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Carpeta para archivos estáticos (CSS, Imágenes, JS del cliente)
app.use(express.static(path.join(__dirname, 'public')));

// Usamos el archivo de rutas
app.use('/', indexRouter); 

// Arrancar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de la Web PSF corriendo en http://localhost:${PORT}`);
});