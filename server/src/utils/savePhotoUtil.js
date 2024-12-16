// Importamos las dependencias.
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

// Función que genera un error.
import generateErrorUtil from './generateErrorUtil.js';

// Función que guarda una foto en la carpeta uploads. Recibe como argumentos la imagen y un ancho en píxeles.
const savePhotoUtil = async (img, width) => {
    try {
        // Generamos la ruta absoluta al directorio de subida de archivos.
        const uploadsPath = path.join(process.cwd(), process.env.UPLOADS_DIR);

        try {
            // Comprobamos si existe el directorio de subida de archivos.
            await fs.access(uploadsPath);
        } catch {
            // Si "access" lanza un error quiere decir que el directorio no existe. Lo creamos.
            await fs.mkdir(uploadsPath);
        }

        // Creamos una imagen de tipo Sharp.
        const sharpImg = sharp(img.data);

        // Redimensionamos la imagen.
        sharpImg.resize(width);

        // Generamos un nombre para el archivo.
        const imgName = `${crypto.randomUUID()}.jpg`;

        // Generamos la ruta al archivo.
        const imgPath = path.join(uploadsPath, imgName);

        // Guardamos la foto en la carpeta de subida de archivos.
        await sharpImg.toFile(imgPath);

        // Retornamos el nombre con el que hemos guardado la imagen.
        return imgName;
    } catch (err) {
        console.error(err);

        generateErrorUtil('Error al guardar el archivo en disco', 500);
    }
};

export default savePhotoUtil;
