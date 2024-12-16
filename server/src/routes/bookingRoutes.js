import express from 'express';

// Importamos las funciones controladoras finales
import {
    adminBookingsController,
    bookOfficeByIdController,
    cancelBookingController,
    getBookingByIdController,
    getBookingsListController,
    voteOfficeAfterUseController,
} from '../controllers/bookings/index.js';

import authUserController from '../middlewares/authUserController.js';

// Creamos un router.
const router = express.Router();

// Empiezan los endpoints

// Endpoint para reservar una oficina por ID (al hacer click en la lista de oficinas entando logeado)
router.post('/booking/:idOffice', authUserController, bookOfficeByIdController);

// Endpoint para ver el detalle de una reserva por ID al hacerle click en la lista de reservas
router.get(
    '/bookings/:idBooking',
    authUserController,
    getBookingByIdController,
);
// Endpoint que edita el valor de la columna votes de la tabla Bookings
router.patch(
    '/bookings/:idBooking/vote',
    authUserController,
    voteOfficeAfterUseController,
);

// Endpoint que permite al admin editar el valor del estado de la reserva
router.patch(
    '/bookings/:idBooking/admin',
    authUserController,
    adminBookingsController,
);
// Endpoint que cancela una reserva por ID
router.patch(
    '/bookings/:idBooking/cancel',
    authUserController,
    cancelBookingController,
);
// Endpoint que lista todas sus reservas para CLIENT y todas las reservas pendientes para ADMIN
router.get('/list/booking', authUserController, getBookingsListController);

export default router;
