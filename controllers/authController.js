import bcrypt from 'bcryptjs';
import Usuario from '../dao/Usuarios.js';

// Controlador para manejar la autenticación de usuarios: login, registro y logout
export const showLogin = (req, res) => {
    if (req.session.user) {
        return res.redirect('/'); //redirigir inicio
    }
    res.render('login', { title: 'Iniciar Sesión', error: null }); 
};
// Mostrar formulario de registro
export const showRegister = (req, res) => {
    if (req.session.user) {
        // Si el usuario ya está logueado, redirigir al inicio
        return res.redirect('/');
    }
    res.render('register', { title: 'Registro', error: null });
};
// manejo registro
export const register = async (req, res) => {
    try {
        const { username, nombre, password, passwordConfirm } = req.body;
        
        const usernameSinespacios = username?.trim();

        if (!usernameSinespacios || !nombre || !password || !passwordConfirm) {
            return res.render('register', { title: 'Registro', error: 'Completa todos los campos.' });
        }
        if (password !== passwordConfirm) {
            return res.render('register', { title: 'Registro', error: 'Las contraseñas no coinciden.' });
        }
        //Comprobar si ya existe un usuario con el mismo nombre de usuario
        const existUser = await Usuario.getByUsername(usernameSinespacios);
        if (existUser) {
            return res.render('register', { title: 'Registro', error: 'Ya existe un usuario con ese nombre de usuario.' });
        }
        // Almacenar la contraseña hasehada 
        const hashedPassword = await bcrypt.hash(password, 10);
        let usuarioId;
        try {
            usuarioId = await Usuario.create({ username: usernameSinespacios, nombre, contrasena: hashedPassword });
        } catch (dbError) {
            if (dbError.message === 'DUPLICATE_USERNAME') {
                return res.render('register', { title: 'Registro', error: 'Ya existe un usuario con ese nombre de usuario.' });
            }
            throw dbError;
        }
        // Inicio de sesion tras registro:
        req.session.user = { id: usuarioId, username: usernameSinespacios, nombre, rol: 'user' };
        res.redirect('/');
    } catch (error) {
        console.error('Error de registro:', error);
        res.status(500).send('Error al registrar el usuario.');
    }
};
// Manejo login:
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const usernameSinespacios = username?.trim();

        if (!usernameSinespacios || !password) {
            return res.render('login', { title: 'Iniciar Sesión', error: 'Completa ambos campos.' });
        }
        //Consulta si existe usuario
        const usuario = await Usuario.getByUsername(usernameSinespacios);
        if (!usuario) {
            return res.render('login', { title: 'Iniciar Sesión', error: 'Usuario o contraseña incorrectos.' });
        }
    //Verificacion de que contraseña ingresada coincide con la almacenada en la base de datos
        const passwordhash = await bcrypt.compare(password, usuario.contrasena);
        if (!passwordhash) {
            return res.render('login', { title: 'Iniciar Sesión', error: 'Usuario o contraseña incorrectos.' });
        }
       // Almacen en sesion: 
        req.session.user = { id: usuario.id, username: usuario.username, nombre: usuario.nombre, rol: usuario.rol };
        // Redirigir al usuario a la página de inicio después de iniciar sesión
        res.redirect('/');
    } catch (error) {
        console.error('Error de login:', error);
        res.status(500).send('Error al iniciar sesión.');
    }
};
//Cerrar sesion usuario
export const logout = (req, res) => {
    //Destruir sesion:
    req.session.destroy(err => {
        if (err) {
            console.error('Error cerrando sesión:', err);
        }
        // Redirigir al usuario a la página de inicio después de cerrar sesión
        res.redirect('/');
    });
};
//Exportar controlador 
const authController = {
    showLogin,
    showRegister,
    register,
    login,
    logout
};

export default authController;
