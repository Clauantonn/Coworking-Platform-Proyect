// Importamos las dependencias.
import express from 'express';

// Importamos las funciones controladoras finales.**
import {
    createOfficeController,
    updateOfficeController,
    listOfficeController,
    getOfficeByIdController,
    deleteOfficeController,
    getEquipmentsController,
    getOfficeEquipmentController,
} from '../controllers/offices/index.js';

import authUserController from '../middlewares/authUserController.js';
import authAdminController from '../middlewares/authAdminController.js';

// Creamos un router.

const router = express.Router();

// Middleware que crea un una officina.
router.post(
    '/office/create',
    authUserController,
    authAdminController,
    createOfficeController,
);

//Middleware para actualizar una oficina
router.put(
    '/office/:idOffice',
    authUserController,
    authAdminController,
    updateOfficeController,
);

// Middleware que retorna el listado de offices.
router.get('/office/list', listOfficeController);

// Middleware que retorna los equipamientos por keyword.
router.get('/office/equipments', getEquipmentsController);

// Middleware que retorna un office concreto por ID.
router.get('/office/:idOffice', getOfficeByIdController);

// Middleware que retorna los equipamientos de una oficina.
router.get('/office/:idOffice/equipments', getOfficeEquipmentController);

// Middleware que elimina una oficina concreto por ID.
router.delete(
    '/office/:idOffice',
    authUserController,
    authAdminController,
    deleteOfficeController,
);

export default router;
