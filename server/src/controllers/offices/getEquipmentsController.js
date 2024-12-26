// Importamos la funcion que retorna una conexion con la base de datos
import getPool from '../../db/getPool.js';

// Funcion que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Funcion controladora que retorna el listado de equipamientos de la oficina segun Id
const getEquipmentsController = async (req, res, next) => {
    try {
        // Obtenemos la palabra clave del equipamiento que buscamos
        let { keyword } = req.query;

        // Si "keyword" contiene un valor considerado falso por JS, asignamos un string vacío.
        keyword = keyword || '';

        // Obtenemos la conexión con la base de datos
        const pool = await getPool();

        //Obtenemos los equipamientos con los ID recibidos
        const [equipments] = await pool.query(
            `SELECT 
                e.id,
                e.name
            FROM equipments e
            WHERE e.name LIKE ?
            GROUP BY e.id
         `,
            [`%${keyword}%`],
        );

        // Si no existe ningun equipamiento con ese ID, generamos un error.
        if (equipments.length < 1) {
            generateErrorUtil('No existe ningún equipamiento', 404);
        }

        //Enviamos una respuesta al usuario
        res.send({
            status: 'ok',
            data: {
                equipments: equipments,
            },
        });
    } catch (err) {
        next(err);
    }
};
export default getEquipmentsController;
