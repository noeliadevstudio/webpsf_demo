import Jugador from '../dao/Jugadores.js';

const renderAdminPanel = async (res, options = {}) => {
    const jugadores = await Jugador.getAllConEstadisticas();
    res.render('admin', {
        jugadores,
        message: options.message || null,
        error: options.error || null
    });
};

export const getAdminPanel = async (req, res) => {
    try {
        await renderAdminPanel(res);
    } catch (error) {
        console.error('Error cargando panel admin:', error);
        res.status(500).send('Error al cargar el panel de administración.');
    }
};

export const addJugador = async (req, res) => {
    try {
        const { nombre, apellido, mote, dorsal, posicion, URL_foto, historico, cant_estrellas } = req.body;

        if (!nombre || nombre.trim() === '') {
            return await renderAdminPanel(res, { error: 'El nombre del jugador es obligatorio.' });
        }

        await Jugador.create({
            nombre: nombre.trim(),
            apellido: apellido?.trim() || null,
            mote: mote?.trim() || null,
            dorsal: dorsal ? Number(dorsal) : null,
            posicion: posicion?.trim() || null,
            URL_foto: URL_foto?.trim() || null,
            historico: historico?.trim() || null,
            cant_estrellas: cant_estrellas ? Number(cant_estrellas) : null
        });

        await renderAdminPanel(res, { message: 'Jugador agregado correctamente.' });
    } catch (error) {
        console.error('Error agregando jugador:', error);
        res.status(500).send('Error al agregar el jugador.');
    }
};

export const updateEstadisticas = async (req, res) => {
    try {
        const { jugador_id, partidos, goles, asistencias, tarjetas_amarillas, tarjetas_rojas } = req.body;

        if (!jugador_id) {
            return await renderAdminPanel(res, { error: 'Selecciona un jugador para actualizar sus estadísticas.' });
        }

        await Jugador.upsertEstadisticas({
            jugador_id: Number(jugador_id),
            partidos: partidos ? Number(partidos) : 0,
            goles: goles ? Number(goles) : 0,
            asistencias: asistencias ? Number(asistencias) : 0,
            tarjetas_amarillas: tarjetas_amarillas ? Number(tarjetas_amarillas) : 0,
            tarjetas_rojas: tarjetas_rojas ? Number(tarjetas_rojas) : 0
        });

        await renderAdminPanel(res, { message: 'Estadísticas actualizadas correctamente.' });
    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
        res.status(500).send('Error al actualizar las estadísticas.');
    }
};

export const addPartido = async (req, res) => {
    try {
        await renderAdminPanel(res, {
            message: 'Formulario de partidos preparado. La funcionalidad de guardar fechas/resultado se implementará cuando la base de datos soporte partidos.',
        });
    } catch (error) {
        console.error('Error procesando partido:', error);
        res.status(500).send('Error al procesar la solicitud de partidos.');
    }
};

const adminController = {
    getAdminPanel,
    addJugador,
    updateEstadisticas,
    addPartido
};

export default adminController;
