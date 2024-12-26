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

        // Construimos un objeto con los campos a actualizar
        const updateFields = {};
        if (email) updateFields.email = email;
        if (username) updateFields.username = username;
        if (name) updateFields.name = name;
        if (lastName) updateFields.lastName = lastName;

        // Si hay campos para actualizar, realizamos un único update.
        if (Object.keys(updateFields).length > 0) {
            const setClause = Object.keys(updateFields)
                .map((field) => `${field} = ?`)
                .join(', ');

            await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [
                ...Object.values(updateFields),
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
