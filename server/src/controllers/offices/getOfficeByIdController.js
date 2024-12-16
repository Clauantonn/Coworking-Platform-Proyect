// Importamos la funcion que retorna una conexion con la base de datos

import getPool from '../../db/getPool.js';

// Funcion que genera un error.

import generateErrorUtil from '../../utils/generateErrorUtil.js';

const getOfficeByIdController = async (req, res, next) => {
    try {
        // Obtenemos id de la oficina que buscamos de los path params.
        let { idOffice } = req.params;

        // Obtenemos la conexión con la base de datos
        const pool = await getPool();

        // Obtenemos los detalles de la oficina junto con el promedio de votos
        const [offices] = await pool.query(
            `
      SELECT
        o.id,
        o.name,
        o.description,
        o.address,
        o.workspace,
        o.capacity,
        o.price,
        o.opening,
        o.closing,
        o.createdAt,
        AVG(b.vote) AS votesAvg,
        COUNT(b.vote) AS totalVotes
      FROM offices o
      LEFT JOIN bookings b ON o.id = b.idOffice
      WHERE o.id = ?
      GROUP BY o.id
      `,
            [idOffice],
        );

        // Si no existe ninguna oficina con ese ID, generamos un error.
        if (offices.length < 1) {
            throw generateErrorUtil('No existe esa oficina', 404);
        }

        // Buscamos las fotos de la oficina
        const [photos] = await pool.query(
            `SELECT id, name FROM officePhotos WHERE idOffice = ?`,
            [offices[0].id],
        );

        // Buscamos los equipamientos de la oficina
        const [equipments] = await pool.query(
            `
      SELECT e.id, e.name
      FROM equipments e
      JOIN officesEquipments oe ON e.id = oe.idEquipment
      WHERE oe.idOffice = ?
      `,
            [offices[0].id],
        );

        // Agregamos las fotos y los equipamientos al objeto de la oficina
        offices[0].photos = photos;
        offices[0].equipments = equipments;

        // Enviamos la respuesta al cliente con la oficina, fotos y equipamientos
        res.send({
            status: 'ok',
            data: {
                offices: offices[0],
            },
        });
    } catch (err) {
        next(err);
    }
};

export default getOfficeByIdController;
