// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Función controladora que retorna el listado de oficinas.
const listOfficeController = async (req, res, next) => {
    try {
        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        // Obtenemos las oficinas.
        const [offices] = await pool.query(
            `
            SELECT 
                o.id,
                o.name,
                o.price,
                o.workspace,
                o.capacity,
                o.address,
                o.createdAt,
                o.opening,      
                o.closing,     
                AVG(CASE WHEN b.vote != 0 THEN b.vote END) AS votesAvg,
                COUNT(CASE WHEN b.vote != 0 THEN 1 END) AS totalVotes
            FROM offices o
            LEFT JOIN bookings b ON b.idOffice = o.id  
            GROUP BY o.id
            `,
        );

        // Recorremos las oficinas en busca de las fotos y equipamientos.
        for (const office of offices) {
            // Buscamos las fotos de la oficina.
            const [photos] = await pool.query(
                `SELECT id, name FROM officePhotos WHERE idOffice = ?`,
                [office.id],
            );

            // Agregamos el array de fotos a la oficina.
            office.photos = photos;

            // Buscamos los equipamientos de la oficina.
            const [equipments] = await pool.query(
                `
                SELECT e.id, e.name
                FROM equipments e
                JOIN officesEquipments oe ON e.id = oe.idEquipment
                WHERE oe.idOffice = ?
                `,
                [office.id],
            );

            // Agregamos el array de equipamientos a la oficina.
            office.equipments = equipments;
        }

        // Si no hay ninguna oficina coworking space, lanzamos un error
        if (offices.length < 1) {
            throw generateErrorUtil('No hay oficinas', 400);
        }

        // Enviamos una respuesta al cliente.
        await res.send({
            status: 'ok',
            data: {
                offices,
            },
        });
    } catch (err) {
        next(err);
    }
};

export default listOfficeController;
