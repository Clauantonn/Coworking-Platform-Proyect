// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Importamos la función que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función controladora que permite votar una oficina con un valor del 1 al 5, tras usarla.
const voteOfficeAfterUseController = async (req, res, next) => {
    try {
        // Obtenemos el ID de la reserva y el ID de la oficina que queremos votar.
        const { idBooking } = req.params;

        // Obtenemos los datos del body.
        let { vote, comment } = req.body;

        // Si voto no tiene valor lanzamos un error.
        if (!vote) {
            generateErrorUtil('Faltan campos', 400);
        }
        // Convertimos en número el valor del voto
        vote = parseInt(vote);

        // Nos aseguramos de que sea un valor correcto por si acaso
        if (![1, 2, 3, 4, 5].includes(vote)) {
            console.log('El voto no es válido');
        }

        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        // Obtenemos el checkout de la reserva.
        const [bookingData] = await pool.query(
            'SELECT checkOut, idOffice FROM bookings WHERE idUser = ? AND id = ?',
            [req.user.id, idBooking],
        );
        console.log(bookingData);
        const bookingCheckout = bookingData[0].checkOut;

        //Comprobamos que la fecha del checkout sea anterior a la actual y lanzamos un error.
        if (new Date(bookingCheckout) > new Date()) {
            generateErrorUtil('La fecha del checkout aún no ha pasado.', 400);
        }

        // Comprobamos si existen votos previos por esa reserva por parte del usuario.
        const [bookingVotes] = await pool.query(
            `SELECT vote FROM bookings WHERE idUser = ? AND id = ?`,
            [req.user.id, idBooking],
        );

        // Si ya existe un voto por parte del usuario lanzamos un error.
        if (bookingVotes[0].length > 0) {
            generateErrorUtil('Ya has votado esta reserva', 403);
        }

        // Insertamos el voto
        await pool.query(
            `UPDATE bookings SET vote = ? , comment = ? WHERE id= ?`,
            [vote, comment, idBooking],
        );

        // Obtenemos la nueva media de votos de la oficina para poder actualizar el State en el cliente.
        const votesAvg = await pool.query(
            `SELECT AVG(vote) AS avg FROM bookings WHERE idOffice = ? AND NOT vote = 0`,
            // eslint-disable-next-line no-undef
            [bookingData.idOffice],
        );

        //Obtenemos la cantidad de votos de la oficina para poder actualizar el State en el cliente
        const [totalVotes] = await pool.query(
            'SELECT Count(*) FROM bookings WHERE NOT vote = 0',
        );

        // Enviamos una respuesta al cliente.
        res.status(201).send({
            status: 'ok',
            message: 'Gracias por tu valoración',
            data: {
                votesAvg: Number(votesAvg[0]).avg,
                totalVotes: Number(totalVotes[0]).avg,
            },
        });
    } catch (err) {
        next(err);
    }
};

export default voteOfficeAfterUseController;
