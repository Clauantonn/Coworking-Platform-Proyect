// Obtener todos los equipamientos de una oficina

import getPool from '../../db/getPool.js';
// Importamos la función getPool desde el archivo getPool.js
import generateErrorUtil from '../../utils/generateErrorUtil.js';

const getOfficeEquipmentController = async (req, res, next) => {
    try {
        const pool = await getPool();
        // Obtenemos una conexión a la base de datos utilizando la función getPool

        const { idOffice } = req.params;
        // Extraemos el parámetro idOffice de los parámetros de la solicitud

        const [equipments] = await pool.query(
            `SELECT e.name 
            FROM officesequipments oe
            INNER JOIN equipments e ON e.id =  oe.idEquipment
            INNER JOIN offices o ON o.id = oe.idOffice
            WHERE idOffice = ?`,
            [idOffice],
        );

        if (equipments.length < 1) {
            generateErrorUtil('No se encontraron equipamientos', 404);
        }

        res.send({
            status: 'ok',
            data: equipments,
        });
        // Enviamos una respuesta al cliente con el estado "ok" y los equipamientos obtenidos
    } catch (err) {
        next(err);
        // Si ocurre un error, lo pasamos al siguiente middleware para su manejo
    }
};

export default getOfficeEquipmentController;
// Exportamos la función getEquipmentList como el export por defecto del módulo
