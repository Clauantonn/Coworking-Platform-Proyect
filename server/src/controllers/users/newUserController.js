// Importamos las dependencias necesarias
import getPool from '../../db/getPool.js'; // Función para obtener la conexión a la base de datos
import bcrypt from 'bcrypt'; // Librería para encriptar contraseñas
import crypto from 'crypto'; // Módulo para generar valores aleatorios
import sendMailUtil from '../../utils/sendMailUtil.js'; // Función para enviar correos electrónicos
import generateErrorUtil from '../../utils/generateErrorUtil.js';

// Definimos el controlador para crear un nuevo usuario
const newUserController = async (req, res, next) => {
    try {
        // Extraemos los datos del cuerpo de la petición
        const { username, name, lastname, email, password } = req.body;

        // Verificamos que todos los campos requeridos estén presentes
        if (!username || !email || !name || !lastname || !password) {
            generateErrorUtil('Faltan campos', 400);
        }

        // Obtenemos la conexión a la base de datos
        const pool = await getPool();

        // Verificamos si ya existe un usuario con el mismo email
        const [user] = await pool.query(
            `
            SELECT * FROM users WHERE email = ?
            `,
            [email],
        );

        // Si ya existe un usuario con ese email, lanzamos un error
        if (user.length > 0) {
            generateErrorUtil('El usuario ya existe', 400);
        }

        // Generamos un código de registro aleatorio
        const registrationCode = crypto.randomBytes(15).toString('hex');

        // Encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertamos el nuevo usuario en la base de datos
        await pool.query(
            `
            INSERT INTO users (username, email, name, lastname, password, registrationCode) VALUES (?, ?, ?, ?, ?, ?)
            `,
            [username, email, name, lastname, hashedPassword, registrationCode],
        );
        try {
            // Preparamos el asunto del correo de activación
            const emailSubject = 'Activación de cuenta';

            // Preparamos el cuerpo del correo de activación
            const emailBody = `
        <p>¡Bienvenid@ ${name}!</p>
        <p>Gracias por registrarte en THE COWORKING. Para activar tu cuenta, haz click en el siguiente enlace:</p>
        <p><a href="${process.env.CLIENT_URL}/users/activate/${registrationCode}">¡Activa tu usuario!</a></p>
        `;

            // Enviamos el correo de activación
            await sendMailUtil(email, emailSubject, emailBody, true);
        } catch {
            console.log(err);

            // Eliminamos el usuario que acabamos de insertar, el cual dió un error al enviar el mail de validación
            await pool.query(`DELETE FROM users WHERE email = ?`, [email]);

            // Si ocurre algún error, lo pasamos al siguiente middleware
            next(err);
        }
        // Enviamos una respuesta exitosa
        res.status(201).send({
            status: 'ok',
            message: 'Usuario registrado correctamente',
        });
    } catch (err) {
        console.log(err);
        // Si ocurre algún error, lo pasamos al siguiente middleware
        next(err);
    }
};

// Exportamos el controlador
export default newUserController;
