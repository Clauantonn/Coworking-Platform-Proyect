// Aqui se importan los controladores de la carpeta users
import activateUserController from './activateUserController.js';
import editProfileUserController from './editProfileUserController.js';
import getProfileUserController from './getProfileUserController.js';
import loginUserController from './loginUserController.js';
import newUserController from './newUserController.js';
import userAvatarController from './userAvatarController.js';
import resetUserPassController from './resetUserPassController.js';
import sendRecoverPassController from './sendRecoverPassController.js';
import changeUserPasswordController from './changeUserPasswordController.js';
// Aqui se exportan los controladores
export {
    activateUserController,
    editProfileUserController,
    newUserController,
    loginUserController,
    getProfileUserController,
    userAvatarController,
    resetUserPassController,
    sendRecoverPassController,
    changeUserPasswordController,
};
