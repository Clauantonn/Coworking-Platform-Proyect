// Importamos la funcion que retorna una conexion a la base de datos
import getPool from '../../db/getPool.js';

// Importamos la función que genera un error
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Importamos la función para enviar correos
import sendMailUtil from '../../utils/sendMailUtil.js';

//Función Controladora que crea una reserva de una oficina por su id y usuario

const bookOfficeByIdController = async (req, res, next) => {
    try {
        // Obtenemos el id de la oficina a reservar y el id del usuario
        const { idOffice } = req.params;
        const idUser = req.user.id;
        const { checkIn, checkOut, guests, price } = req.body;

        //Obtenemos una conexión con la base de datos
        const pool = await getPool();

        // Verificamos si la oficina existe
        const [office] = await pool.query(
            'SELECT id, capacity, name FROM offices WHERE id = ?',
            [idOffice],
        );

        if (office.length === 0) {
            throw generateErrorUtil('No existe la oficina solicitada', 404);
        }

        // Verificamos que las fechas son v��lidas
        if (
            new Date(checkIn) >= new Date(checkOut) ||
            new Date(checkIn) < new Date()
        ) {
            throw generateErrorUtil(
                'El check-in tiene que ser antes que el check-out',
                400,
            );
        }

        // Función para validar si una fecha/hora tiene minutos diferentes a '00'
        const isHourFull = (dateString) => {
            const date = new Date(dateString);
            const minutes = date.getMinutes();
            return minutes === 0;
        };

        // Verificamos checkIn y checkOut
        if (!isHourFull(checkIn) || !isHourFull(checkOut)) {
            throw generateErrorUtil(
                ' La hora seleccionada debe ser en horas completas (por ejemplo, 10:00)',
                400,
            );
        }

        // Comprobamos si ya hay una reserva pendiente o confirmada sobre esta oficina
        // Verificamos si la oficina está disponible en las fechas seleccionadas
        const [existingBookings] = await pool.query(
            `SELECT id FROM bookings 
                            WHERE idOffice = ? 
                            AND status IN ('PENDING', 'CONFIRMED')
                            AND (
                                (? < checkOut AND ? > checkIn)
                            )`,
            [idOffice, checkIn, checkOut],
        );

        if (existingBookings.length > 0) {
            throw generateErrorUtil(
                'La oficina no está disponible en las fechas seleccionadas',
                400,
            );
        }

        if (guests > office[0].capacity) {
            throw generateErrorUtil('Capacidad menor', 400);
        }

        // Obtenemos los datos del usuario para enviar el correo
        const [userData] = await pool.query(
            'SELECT email, name FROM users WHERE id = ?',
            [idUser],
        );

        // Enviamos un correo al usuario
        const emailSubject = 'Reserva realizada con éxito';
        const emailBody = `
        <p>Hola ${userData[0].name},</p>

        <p>Tu reserva en Innovaspace ha sido realizada con éxito y está pendiente de confirmación por un administrador.</p>
      
       <p>Te notificaremos cuando tu reserva sea confirmada.</p>

       <p>Gracias por usar nuestro servicio.</p>
        `;
        await sendMailUtil(userData[0].email, emailSubject, emailBody, true);

        // Obtenemos el correo del administrador
        const [adminData] = await pool.query(
            'SELECT email, username FROM users WHERE role = "ADMIN" LIMIT 1',
        );

        if (adminData.length > 0) {
            // Enviamos un correo al administrador
            const adminEmailSubject = 'Nueva reserva pendiente de confirmación';
            const adminEmailBody = `
            <p>Hola ${adminData[0].username},</p>

           <p> Se ha realizado una nueva reserva que requiere tu confirmación:</p>

           <p> Usuario: ${userData[0].name}, ${userData[0].email}.</p>

           <p> Oficina: ${office[0].name}.</p>

           <p> Precio: €${price}.</p>

           <p> Por favor, accede al panel de administración para confirmar o rechazar esta reserva.</p>

           <p> Gracias.</p>
            `;

            await sendMailUtil(
                adminData[0].email,
                adminEmailSubject,
                adminEmailBody,
                true,
            );
            // Creamos la reserva con estado 'PENDING'
            await pool.query(
                `INSERT INTO bookings (idUser, idOffice, checkIn, checkOut ,guests, status,createdAt, price) 
             VALUES (?, ?, ? , ?, ?,'PENDING',NOW(), ?) `,
                [idUser, idOffice, checkIn, checkOut, guests, price],
            );
        }

        // Enviamos la respuesta
        res.status(201).send({
            status: 'ok',
            message: 'Reserva creada con éxito y pendiente de confirmación',
            data: {
                idUser,
                idOffice,
                checkIn,
                checkOut,
                guests,
                status: 'PENDING',
                price,
            },
        });
    } catch (err) {
        next(err);
    }
};

export default bookOfficeByIdController;
