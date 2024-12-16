// Añadimos al proceso actual la lista de variables de entorno del fichero ".env".
import 'dotenv/config';

// Importamos las dependencias necesarias.
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fileUpload from 'express-fileupload';
// Importamos las rutas.
import userRoutes from './src/routes/userRoutes.js';
import officeRoutes from './src/routes/officeRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';

// Importamos las variables de entorno necesarias.
const { PORT, UPLOADS_DIR } = process.env;

// Creamos el servidor.
const app = express();

// Middleware que evita problemas de conexión entre cliente y servidor.
app.use(cors());

// Middleware que indica a Express cuál es el directorio de ficheros estáticos.
app.use(express.static(UPLOADS_DIR));

// Middleware que muestra por consola info sobre la petición entrante.
app.use(morgan('dev'));

// Middleware que permite leer un body en formato JSON.
app.use(express.json());

// Middleware que permite leer un body en formato "form-data" (para archivos).
// Se instala fileupload para luego poder usarlo en el client.
app.use(fileUpload());

// Middleware que indica a Express dónde están las rutas.
app.use('/api', userRoutes);
app.use('/api', officeRoutes);
app.use('/api', bookingRoutes);

// Middleware de manejo de errores.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.httpStatus || 500).send({
        status: 'error',
        message: err.message,
    });
});

// Middleware de ruta no encontrada.
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Ruta no encontrada',
    });
});

// Indicamos al servidor que escuche peticiones en un puerto dado.
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
