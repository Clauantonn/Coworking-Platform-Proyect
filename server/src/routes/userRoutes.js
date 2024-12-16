import express from 'express';

// Importamos las funciones controladores finales
import {
    newUserController,
    activateUserController,
    loginUserController,
    getProfileUserController,
    userAvatarController,
    editProfileUserController,
    sendRecoverPassController,
    resetUserPassController,
    changeUserPasswordController,
} from '../controllers/users/index.js';

// importamos las funciones controladoras intermedias
import authUserController from '../middlewares/authUserController.js';
import authAdminController from '../middlewares/authAdminController.js';

// Aqui se importan los controladores.

const router = express.Router();

// Aqui van los endpoints.

//Controlador que permite registrar un usuario.
router.post('/users/register', newUserController);

// Controlador que permite activar un usuario. Inicialmente un PUT, pero sugerido que se cambiara a PATCH
router.patch('/users/activate/:registrationCode', activateUserController);

// Controlador que permite loguear un usuario.
router.post('/users/login', loginUserController);

// Controlador que retorna el perfil de un usuario
router.get('/users/profile', authUserController, getProfileUserController);

//Controlador que permite actualizar el perfil de un usuario
router.patch(
    '/users/editProfile',
    authUserController,
    editProfileUserController,
);
//Controlador que permite actualizar el password
router.patch(
    '/users/password',
    authUserController,
    changeUserPasswordController,
);

// Controlador que actualiza el avatar de un usuario. Inicialmente un put, pero sugerido que sea un PATCH
router.patch('/users/avatar', authUserController, userAvatarController);

// Middleware que permite enviar un correo de recuperación de contraseña.
router.put('/users/password/recover', sendRecoverPassController);

// Middleware que permite resetear la contraseña con un código.
router.put('/users/password/reset/:recoverPassCode', resetUserPassController);

export default router;
