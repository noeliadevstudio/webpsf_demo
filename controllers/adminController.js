import Jugador from '../dao/Jugadores.js';
import Partido from '../dao/Partidos.js';

// Función auxiliar para renderizar el panel de administración con jugadores y partidos
const renderAdminPanel = async (res, options = {}) => {
    const jugadores = await Jugador.getAllConEstadisticas();
    const partidos = await Partido.getAll();
    res.render('admin', {
        jugadores,
        partidos,
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
        const { nombre, apellido, mote, dorsal, posicion, URL_foto, historico } = req.body;

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
            historico: historico?.trim() || null
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
        const { fecha, rival, terminado, resultado } = req.body;

        if (!fecha || !rival || rival.trim() === '') {
            return await renderAdminPanel(res, { error: 'Fecha y rival son obligatorios para guardar el partido.' });
        }

        const terminadoBool = terminado === 'on';

        if (terminadoBool && (!resultado || resultado.trim() === '')) {
            return await renderAdminPanel(res, { error: 'Debes indicar el resultado cuando marcas el partido como jugado.' });
        }

        await Partido.create({
            fecha,
            rival: rival.trim(),
            terminado: terminadoBool,
            resultado: resultado?.trim() || null
        });

        await renderAdminPanel(res, { message: 'Partido agregado correctamente.' });
    } catch (error) {
        console.error('Error agregando partido:', error);
        res.status(500).send('Error al agregar el partido.');
    }
};

export const updatePartido = async (req, res) => {
    try {
        const { id, fecha, rival, terminado, resultado } = req.body;

        if (!id) {
            return await renderAdminPanel(res, { error: 'ID de partido inválido.' });
        }

        if (!fecha || !rival || rival.trim() === '') {
            return await renderAdminPanel(res, { error: 'Fecha y rival son obligatorios para actualizar el partido.' });
        }

        const terminadoBool = terminado === 'on';

        if (terminadoBool && (!resultado || resultado.trim() === '')) {
            return await renderAdminPanel(res, { error: 'Debes indicar el resultado cuando el partido está marcado como jugado.' });
        }

        const actualizado = await Partido.update({
            id: Number(id),
            fecha,
            rival: rival.trim(),
            terminado: terminadoBool,
            resultado: resultado?.trim() || null
        });

        if (!actualizado) {
            return await renderAdminPanel(res, { error: 'No se encontró el partido para actualizar.' });
        }

        await renderAdminPanel(res, { message: 'Partido actualizado correctamente.' });
    } catch (error) {
        console.error('Error actualizando partido:', error);
        res.status(500).send('Error al actualizar el partido.');
    }
};

export const deletePartido = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return await renderAdminPanel(res, { error: 'ID de partido inválido.' });
        }

        const eliminado = await Partido.deleteById(Number(id));

        if (!eliminado) {
            return await renderAdminPanel(res, { error: 'No se encontró el partido para borrar.' });
        }

        await renderAdminPanel(res, { message: 'Partido borrado correctamente.' });
    } catch (error) {
        console.error('Error borrando partido:', error);
        res.status(500).send('Error al borrar el partido.');
    }
};

export const updateFoto = async (req, res) => {
    try {
        const { jugador_id, URL_foto } = req.body;

        if (!jugador_id) {
            return await renderAdminPanel(res, { error: 'Selecciona un jugador para actualizar su foto.' });
        }

        if (!URL_foto || URL_foto.trim() === '') {
            return await renderAdminPanel(res, { error: 'Debes proporcionar una URL de foto.' });
        }

        const actualizado = await Jugador.updateFoto(Number(jugador_id), URL_foto.trim());

        if (actualizado) {
            await renderAdminPanel(res, { message: 'Foto del jugador actualizada correctamente.' });
        } else {
            await renderAdminPanel(res, { error: 'No se pudo actualizar la foto. Jugador no encontrado.' });
        }
    } catch (error) {
        console.error('Error actualizando foto:', error);
        res.status(500).send('Error al actualizar la foto.');
    }
};

const adminController = {
    getAdminPanel,
    addJugador,
    updateEstadisticas,
    addPartido,
    updatePartido,
    deletePartido,
    updateFoto
};

export default adminController;
