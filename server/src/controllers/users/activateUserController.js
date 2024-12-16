import getPool from '../../db/getPool.js';

import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función controladora que activa un usuario.
const activateUserController = async (req, res, next) => {
    try {
        // Obtenemos el código de registro.
        const { registrationCode } = req.params;

        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        // Obtenemos al usuario con el código de registro recibido.
        const [users] = await pool.query(
            `SELECT id FROM users WHERE registrationCode = ?`,
            [registrationCode],
        );

        // Si no existe ningún usuario con el código de registro recibido lanzamos un error.
        if (users.length < 1) {
            generateErrorUtil('Código de registro inválido', 401);
        }

        // Activamos el usuario.
        await pool.query(
            `UPDATE users SET registrationCode = NULL, active = true WHERE registrationCode = ?`,
            [registrationCode],
        );

        // Enviamos una respuesta al cliente.
        res.send({
            status: 'ok',
            message: 'Usuario activado',
        });
    } catch (err) {
        next(err);
    }
};

export default activateUserController;
