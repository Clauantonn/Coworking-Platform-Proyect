// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Función controladora que retorna el listado de reservas.
const getBookingsListController = async (req, res, next) => {
    try {
        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        let arrayQuery = [];
        let strQuery = `
            SELECT  
                b.id AS idBooking,
                b.idUser,
                b.idOffice,
                b.checkIn,
                b.checkOut,
                b.guests,
                b.status,
                b.createdAt,
                u.username,
                o.name AS nameOffice,
                o.workspace,
                o.capacity,
                b.price
            FROM bookings b
            INNER JOIN users u ON u.id = b.idUser
            INNER JOIN offices o ON o.id = b.idOffice
            `;

        // Si el usuario no es admin, filtra con un WHERE y muestra sus reservas
        if (req.user.role !== 'ADMIN') {
            strQuery = strQuery + 'WHERE u.id = ?';
            arrayQuery.push(req.user.id);
        } else {
            strQuery = strQuery + 'ORDER BY b.status';
        }

        // Obtenemos el listado de reservas.
        const [bookings] = await pool.query(strQuery, arrayQuery);

        // Recorremos las reservas en busca de las fotos.
        for (const booking of bookings) {
            // Buscamos las fotos de la oficina.
            const [photos] = await pool.query(
                `SELECT id, name FROM officePhotos WHERE IdOffice = ?`,
                [booking.idOffice],
            );

            // Agregamos el array de fotos a la reserva.
            booking.photos = photos;
        }
        // Si no hay ninguna reserva , devuelve un array vacio que en el Front usaremos
        res.send({
            status: 'ok',
            data: {
                bookings,
            },
        });
    } catch (err) {
        next(err);
    }
};

export default getBookingsListController;
