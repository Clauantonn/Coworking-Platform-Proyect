// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Importamos la función que borra una foto.
import removePhotoUtil from '../../utils/removePhotoUtil.js';

// Importamos el middleware de errores
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función controladora que elimina una entrada concreta por ID.
const deleteOfficeController = async (req, res, next) => {
    try {
        // Obtenemos el ID de la entrada a eliminar.
        const { idOffice } = req.params;

        const currentTime = new Date();
        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        //  YA NO HACE FALTA COMPROBAR SI TIENE BOOKINGS
        const [bookings] = await pool.query(
            `SELECT id FROM bookings WHERE idOffice = ? AND status IN ('CONFIRMED', 'PENDING') AND checkOut > ?`,
            [idOffice, currentTime],
        );

        if (bookings.length > 0) {
            generateErrorUtil(
                'No puedes borrar una oficina con reservas pendientes o confirmadas. Debes rechazarlas primero.',
                403,
            );
        }

        // Eliminamos las reservas de la base de datos.
        await pool.query(`DELETE FROM bookings WHERE idOffice = ?`, [idOffice]);

        // Localizamos las fotos vinculadas a la entrada.
        const [photos] = await pool.query(
            `SELECT name FROM officePhotos WHERE idOffice = ?`,
            [idOffice],
        );

        // Si hay alguna foto las eliminamos del disco.
        for (const photo of photos) {
            await removePhotoUtil(photo.name);
        }

        // Eliminamos las fotos de la base de datos.
        await pool.query(`DELETE FROM officePhotos WHERE idOffice = ?`, [
            idOffice,
        ]);

        // Eliminamos los equipamientos de la oficina de la base de datos.
        await pool.query(`DELETE FROM officesEquipments WHERE idOffice = ?`, [
            idOffice,
        ]);

        // Eliminamos la entrada.
        await pool.query(`DELETE FROM offices WHERE id = ?`, [idOffice]);

        // Enviamos una respuesta al cliente.
        res.send({
            status: 'ok',
            message: 'Entrada eliminada',
        });
    } catch (err) {
        next(err);
    }
};

export default deleteOfficeController;
