import jwt from 'jsonwebtoken';

import generateErrorUtil from '../utils/generateErrorUtil.js';

// Función controladora intermedia que desencripta el token y agrega la info del
// usuario al objeto request.
const authUserController = async (req, res, next) => {
    try {
        // Obtenemos el token de la cabecera de la petición.
        const { authorization } = req.headers;

        // Si falta el token lanzamos un error.
        if (!authorization) {
            generateErrorUtil('Falta la cabecera de autorización', 401);
        }

        try {
            // Desencriptamos el token.
            const tokenInfo = jwt.verify(authorization, process.env.SECRET);

            // Añadimos al objeto request una propiedad inventada por nosotros para
            // almacenar la info del usuario.
            req.user = tokenInfo;

            // Pasamos el control al siguiente middleware. Esto hará que el siguiente
            // middleware tenga acceso a "req.user.id" y "req.user.role".
            next();
        } catch (err) {
            console.error(err);

            generateErrorUtil('Token inválido', 401);
        }
    } catch (err) {
        next(err);
    }
};

export default authUserController;
