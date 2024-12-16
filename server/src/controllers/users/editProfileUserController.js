// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Función que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// funcion que permite al usuario modificar su perfil.

const editProfileUserController = async (req, res, next) => {
    try {
        // Obtenemos el ID del usuario que queremos editar

        const idUser = req.user.id;

        // obtenemos los datos del body que permitimos modificar

        const { email, username, name, lastName } = req.body;

        // lanzamos un error si faltan campos por actualizar

        if (!email && !username && !name && !lastName) {
            generateErrorUtil('Faltan Campos', 400);
        }

        // obtenemos la conexion con la base de datos
        const pool = await getPool();

        // obtenemos la informacion del usuar que queremos editar

        const [users] = await pool.query(
            ` SELECT id FROM users WHERE id = ? `,
            [idUser],
        );

        // si el usuario no existe lazamos un error

        if (users.length < 1) {
            generateErrorUtil(' Usuario no encontrado ', 404);
        }

        // Si el usuario ha enviado un email lo actualizamos.
        if (email) {
            await pool.query(`UPDATE users SET email = ? WHERE id = ?`, [
                email,
                idUser,
            ]);
        }
        // Si el usuario ha enviado un username lo actualizamos.
        if (username) {
            await pool.query(`UPDATE users SET username = ? WHERE id = ?`, [
                username,
                idUser,
            ]);
        }
        // Si el usuario ha enviado un nombre lo actualizamos.
        if (name) {
            await pool.query(`UPDATE users SET name = ? WHERE id = ?`, [
                name,
                idUser,
            ]);
        }
        // Si el usuario ha enviado un apellido lo actualizamos.
        if (lastName) {
            await pool.query(`UPDATE users SET lastName = ? WHERE id = ?`, [
                lastName,
                idUser,
            ]);
        }

        // Enviamos una respuesta al cliente.
        res.send({
            status: 'ok',
            message: 'Perfil de usuario actualizado',
            data: {
                email,
                username,
                name,
                lastName,
            },
        });
    } catch (err) {
        next(err);
    }
};

export default editProfileUserController;
