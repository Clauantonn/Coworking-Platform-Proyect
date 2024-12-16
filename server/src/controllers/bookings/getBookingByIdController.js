// Importamos la funcion que retorna una conexion con la base de datos
import getPool from '../../db/getPool.js';

// Funcion que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Funcion controladora que retorna el listado de oficinas
const getBookingByIdController = async (req, res, next) => {
    try {
        // Obtenemos id de la reserva que buscamos de los path params.
        let { idBooking } = req.params;

        // Obtenemos la conexión con la base de datos
        const pool = await getPool();

        //Obtenemos las reservas con el ID recibido
        const [bookings] = await pool.query(
            `
            SELECT  
                b.id,
                b.idUser,
                b.idOffice,
                o.name AS officeName,
                b.checkIn,
                b.checkOut,
                b.guests,
                b.status,
                b.createdAt,
                u.id,
                u.username,
                -- u.email,
                o.name,
                o.workspace,
                o.capacity,
                b.price

            FROM bookings b
            INNER JOIN users u ON u.id = b.idUser
            INNER JOIN offices o ON o.id = b.idOffice
            WHERE b.id = ?
            `,
            [idBooking],
        );

        // Si no existe ninguna reserva con ese ID, y comprobando que eres el usuario que hizo esa reserva, generamos un error.
        if (
            bookings.length < 1 ||
            (req.user.role !== 'ADMIN' && req.user.id !== bookings[0].idUser)
        ) {
            generateErrorUtil('No existen reservas coincidentes', 404);
        }

        // Buscamos la foto de la oficina (crear tabla fotos)

        const [photos] = await pool.query(
            `SELECT id, name FROM officePhotos WHERE idOffice = ?`,
            [bookings[0].idOffice],
        );

        // Agregamos el array de fotos a la officina

        bookings[0].photos = photos;

        //Enviamos una respuesta al usuario
        res.send({
            status: 'ok',
            data: {
                booking: bookings[0],
            },
        });
    } catch (err) {
        next(err);
    }
};

export default getBookingByIdController;
