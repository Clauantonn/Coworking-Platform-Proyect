import getPool from '../../db/getPool.js';
import bcrypt from 'bcrypt';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

const changeUserPasswordController = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        if (!currentPassword || !newPassword) {
            generateErrorUtil('Faltan campos', 400);
        }

        const pool = await getPool();

        // Verificar la contraseña actual
        const [user] = await pool.query(
            'SELECT password FROM users WHERE id = ?',
            [userId],
        );

        if (user.length === 0) {
            generateErrorUtil('Usuario no encontrado', 404);
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user[0].password,
        );

        if (!isPasswordValid) {
            generateErrorUtil('La contraseña actual es incorrecta', 401);
        }

        // Generar hash de la nueva contraseña
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [
            hashedNewPassword,
            userId,
        ]);

        res.send({
            status: 'ok',
            message: 'Contraseña actualizada correctamente',
        });
    } catch (err) {
        next(err);
    }
};

export default changeUserPasswordController;
