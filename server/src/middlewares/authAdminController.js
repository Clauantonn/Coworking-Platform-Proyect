import generateErrorUtil from '../utils/generateErrorUtil.js';

const authAdminController = (req, res, next) => {
    try {
        // Verificamos que req.user exista
        if (!req.user) {
            throw generateErrorUtil('Usuario no valido', 401);
        }

        // Extraemos el rol del usuario
        const { role } = req.user;

        // Verificamos que el usuario sea un admin
        if (role !== 'ADMIN') {
            throw generateErrorUtil(
                'Acceso denegado. Se requieren permisos de administrador.',
                403,
            );
        }

        // Si el usuario es admin, continuamos con el siguiente middleware
        next();
    } catch (error) {
        next(error);
    }
};

export default authAdminController;
