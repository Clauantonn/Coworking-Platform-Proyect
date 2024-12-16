// Obtenemos la conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Obtenemos el codigo de gestion de errores.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Importamos la función para enviar correos
import sendMailUtil from '../../utils/sendMailUtil.js';

// Funcion que elimina una reserva.
const cancelBookingController = async (req, res, next) => {
    try {
        // Obtenemos el ID de la reserva.
        const { idBooking } = req.params;

        // Conectamos con la base de datos.
        const pool = await getPool();

        // Obtenemos el id del usuario. Solo mostramos las reservas que estan a su nombre.
        const idUser = req.user.id;
        const [booking] = await pool.query(
            `SELECT 
                b.idOffice,
                b.checkIn,
                b.checkOut,
                b.guests,
                b.status,
                b.createdAt, 
                TIMESTAMPDIFF(HOUR, NOW(), checkIn) AS hours_to_checkin,
                o.name
                 FROM bookings b
                 INNER JOIN offices o ON o.id = b.idOffice
                 WHERE b.id=? AND b.idUser=? AND TIMESTAMPDIFF(HOUR, NOW(), checkIn) > 24;`,
            [idBooking, idUser],
        );

        // Si no hay reservas, generamos un error.
        if (booking.length < 1) {
            throw generateErrorUtil(
                'No se ha encontrado ninguna reserva coincidente para la que falten más de 24 horas.',
                404,
            );
        }

        // Enviamos un correo al usuario

        // Obtenemos el correo del usuario
        const [userData] = await pool.query(
            'SELECT name, email FROM users WHERE id = ?',
            [idUser],
        );

        const emailSubject = 'Reserva cancelada con éxito';
        const emailBody = `
                <p>Hola ${userData[0].name},</p>

                <p>Tu reserva con Innovaspace ha sido cancelada con éxito.</p>

                <p>Gracias por usar nuestro servicio.</p>
            `;
        await sendMailUtil(userData[0].email, emailSubject, emailBody, true);

        // Obtenemos el correo del administrador
        const [adminData] = await pool.query(
            'SELECT email, username FROM users WHERE role = ?  LIMIT 1',
            ['ADMIN'],
        );

        // Enviamos un correo al administrador
        const adminEmailBody = `
            <p>Hola ${adminData.username},</p>

             <p>Un usuario ha cancelado su reserva.</p>

             <p>Reserva: ${idBooking}</p>
             <p>Usuario: ${userData[0].name} (ID: ${idUser})</p>
             <p>Oficina: #${booking[0].idOffice}</p>

             <p>Gracias.</p>
            `;

        await sendMailUtil(
            adminData[0].email,
            emailSubject,
            adminEmailBody,
            true,
        );

        // Cambiamos a CANCELED el status de la reserva de la base de datos.
        await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [
            'CANCELED',
            idBooking,
        ]);

        // Enviamos un mensaje de OK al usuario.
        res.send({
            status: 'ok',
            message: 'La reserva se ha cancelado con exito',
        });
    } catch (err) {
        next(err);
    }
};

export default cancelBookingController;
