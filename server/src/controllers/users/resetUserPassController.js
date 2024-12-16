// Importamos las funciones y módulos necesarios
import getPool from '../../db/getPool.js'; // Importa la función para obtener la conexión a la base de datos
import bcrypt from 'bcrypt'; // Importa el módulo bcrypt para el hash de contraseñas
import generateErrorUtil from '../../utils/generateErrorUtil.js'; // Importa la función para generar errores

// Definimos el controlador para restablecer la contraseña del usuario
const resetUserPassController = async (req, res, next) => {
    try {
        // Extraemos el código de recuperación de los parámetros de la solicitud
        const { recoverPassCode } = req.params;
        // Extraemos la nueva contraseña y su repetición del cuerpo de la solicitud
        const { newPassword, repeatNewPassword } = req.body;
        // Verificamos si se han proporcionado ambas contraseñas
        if (!newPassword || !repeatNewPassword) {
            generateErrorUtil('Faltan campos', 400);
        }

        // Verificamos si las contraseñas coinciden
        if (newPassword !== repeatNewPassword) {
            generateErrorUtil('Las contraseñas no coinciden', 400);
        }

        // Obtenemos la conexión a la base de datos
        const pool = await getPool();

        // Buscamos al usuario con el código de recuperación proporcionado
        const [user] = await pool.query(
            `
            SELECT * FROM users WHERE recoverPassCode = ?`,
            [recoverPassCode],
        );

        // Si no se encuentra ningún usuario, generamos un error
        if (user.length < 1) {
            generateErrorUtil(
                'No se ha encontrado ningún usuario con ese código de recuperación',
                404,
            );
        }

        // Generamos el hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizamos la contraseña del usuario y eliminamos el código de recuperación
        await pool.query(
            `UPDATE users SET password = ?, recoverPassCode = NULL WHERE recoverPassCode = ?`,
            [hashedPassword, recoverPassCode],
        );

        // Enviamos una respuesta exitosa
        res.send({
            status: 'ok',
            message: 'La contraseña se ha restablecido correctamente',
        });
    } catch (err) {
        // Si ocurre un error, lo pasamos al siguiente middleware
        next(err);
    }
};

// Exportamos el controlador
export default resetUserPassController;
