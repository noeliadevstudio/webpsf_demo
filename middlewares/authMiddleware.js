// verificar si el usuario esta autenticado para acceder a ciertas rutas y si es admin para acceder a rutas de admin: 
export const ensureAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

export const ensureAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.rol !== 'admin') {
        return res.status(403).send('Acceso denegado. Solo administradores pueden acceder.');
    }
    next();
};

const authMiddleware = {
    ensureAuthenticated,
    ensureAdmin
};

export default authMiddleware;
