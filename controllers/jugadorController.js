const Jugador = require('../models/Jugador');

exports.getPlantilla = async (req, res) => {
    try {
        const jugadores = await Jugadorr.getAllWithStats();
        res.render('players', { jugadores });
    } catch (error) {
        console.error("Error en el controlador de jugadores:", error);
        res.status(500).send("Error al cargar la plantilla");
    }
};