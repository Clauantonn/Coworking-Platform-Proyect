// Importamos las dependencias.
import nodemailer from 'nodemailer';

// Importamos la función que genera un error.
import generateErrorUtil from './generateErrorUtil.js';

// Importamos las variables de entorno necesarias.
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

// Creamos una conexión para poder enviar el email.
const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false, // Permitir certificados autofirmados (solo para desarrollo)
    },
});

// Función que envía un email.
const sendMailUtil = async (receiverEmail, subject, body, isHtml = false) => {
    try {
        await transport.sendMail({
            from: SMTP_USER,
            to: receiverEmail,
            subject,
            [isHtml ? 'html' : 'text']: body,
        });
    } catch (err) {
        console.error(err);

        generateErrorUtil('Error al enviar email', 500);
    }
};

export default sendMailUtil;
