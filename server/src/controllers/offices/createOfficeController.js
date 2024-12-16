// Importamos la función que retorna una conexión con la base de datos.
import getPool from '../../db/getPool.js';

// Importamos la función que guarda una foto.
import savePhotoUtil from '../../utils/savePhotoUtil.js';

// Función que genera un error.
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// importamos el auth controller que le da permisos al admin

// Función controladora que permite registrar una oficina.
const createOfficeController = async (req, res, next) => {
    try {
        // Obtenemos los datos del body.
        const {
            name,
            price,
            description,
            address,
            workspace,
            capacity,
            equipments,
            opening,
            closing,
        } = req.body;

        // Verificamos que el horario este bien.
        if (opening >= closing) {
            throw generateErrorUtil(
                'El horario de cierre tiene que ser posterior al de apertura',
                400,
            );
        }

        // Verificamos si `equipments` ya es un array o si es una cadena JSON y la convertimos.
        const equipmentsArray = Array.isArray(equipments)
            ? equipments
            : JSON.parse(equipments);

        if (equipmentsArray.length === 0) {
            throw generateErrorUtil(
                'Se requiere al menos un equipamiento.',
                400,
            );
        }

        // Obtenemos el array de fotos, limitamos a 5 fotos.
        const photosArr = req.files ? Object.values(req.files).slice(0, 5) : [];

        // Validamos que todos los campos obligatorios estén presentes.
        const requiredFields = {
            name,
            price,
            description,
            address,
            workspace,
            capacity,
            equipmentsArray,
            opening,
            closing,
        };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                throw generateErrorUtil(`El campo ${key} es obligatorio.`, 400);
            }
        }

        if (photosArr.length < 1) {
            throw generateErrorUtil('Se requiere al menos una foto.', 400);
        }

        // Obtenemos una conexión con la base de datos usando el pool.
        const pool = await getPool();

        // Insertamos la oficina en la tabla `offices`.
        const [newOffice] = await pool.query(
            `INSERT INTO offices (name, price, description, address, workspace, capacity, opening, closing) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                price,
                description,
                address,
                workspace,
                capacity,
                opening,
                closing,
            ],
        );

        // Obtenemos el ID de la nueva oficina.
        const idOffice = newOffice.insertId;

        // Guardamos las fotos de la oficina.
        for (const photo of photosArr) {
            const photoName = await savePhotoUtil(photo, 500); // Guardar la foto en el servidor.

            // Insertamos la foto en la tabla `officePhotos`.
            await pool.query(
                `INSERT INTO officePhotos (name, idOffice) VALUES (?, ?)`,
                [photoName, idOffice],
            );
        }

        // Validamos y guardamos los equipamientos asociados a la oficina en `officesEquipments`.
        //const equipmentValues = [];
        for (const idEquipment of equipmentsArray) {
            // Validamos que el equipamiento exista en la tabla `equipments`.
            const [equipmentExists] = await pool.query(
                `SELECT id FROM equipments WHERE id = ?`,
                [idEquipment],
            );

            if (equipmentExists.length === 0) {
                throw generateErrorUtil(
                    `El equipamiento con ID ${idEquipment} no existe`,
                    404,
                );
            }

            // Preparamos los valores a insertar en la relación.
            //equipmentValues.push([idOffice, idEquipment]);
            // Insertamos todas las relaciones de `officesEquipments` de una sola vez.
            await pool.query(
                `INSERT INTO officesEquipments (idOffice, idEquipment) VALUES (?,?) `,
                [idOffice, idEquipment],
            );
        }

        // Establecemos el código 201 (elemento creado) y enviamos una respuesta al cliente.
        res.status(201).send({
            status: 'ok',
            message: 'Oficina creada con éxito',
        });
    } catch (err) {
        next(err);
    }
};

export default createOfficeController;
