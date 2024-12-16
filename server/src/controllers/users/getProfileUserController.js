// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';
// Esta línea importa la función getPool desde el archivo getPool.js ubicado en la carpeta db. Esta función se utiliza para obtener una conexión a la base de datos.

// Función que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';
// Aquí importamos la función generateError desde el archivo generateError.js en la carpeta helpers. Esta función se usa para generar errores personalizados.

// Función que retorna info privada del usuario.
const getProfileUserController = async (req, res, next) => {
    // Esta es la definición de la función principal del controlador. Es asíncrona y toma tres parámetros: req (solicitud), res (respuesta) y next (función para pasar al siguiente middleware).
    try {
        // Obtenemos el ID del usuario del token.
        const userId = req.user.id;
        // Extraemos el ID del usuario del objeto req.user, que presumiblemente fue añadido por un middleware de autenticación previo.

        // Obtenemos la conexión con la base de datos.
        const pool = await getPool();
        // Llamamos a getPool() para obtener una conexión a la base de datos. Usamos await porque getPool() es probablemente una función asíncrona.

        // Obtenemos los datos del usuario.
        const [users] = await pool.query(
            `SELECT id, username, email, name, lastName, role ,avatar FROM users WHERE id = ?`,
            [userId],
        );
        // Ejecutamos una consulta SQL para obtener el id, email y avatar del usuario con el ID especificado. El resultado se desestructura para obtener el primer elemento del array retornado.

        // Si no existe ningún usuario lanzamos un error.
        if (users.length < 1) {
            generateErrorUtil('Usuario no encontrado', 404);
        }
        // Verificamos si se encontró algún usuario. Si no, generamos un error con un mensaje y código de estado 404.

        // Enviamos una respuesta al cliente.
        res.send({
            status: 'ok',
            data: {
                user: users[0],
            },
        });
        // Si todo va bien, enviamos una respuesta al cliente con el estado 'ok' y los datos del usuario encontrado.
    } catch (err) {
        next(err);
        // Si ocurre algún error durante la ejecución, lo pasamos al siguiente middleware de manejo de errores.
    }
};

export default getProfileUserController;
// Exportamos la función del controlador para que pueda ser utilizada en otros archivos.
