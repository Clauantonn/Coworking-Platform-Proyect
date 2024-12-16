// Añadimos al proceso actual la lista de variables de entorno que figuran en el fichero ".env".
import 'dotenv/config';

import bcrypt from 'bcrypt'; // Librería para encriptar contraseñas

// Función que retorna una conexión con la base de datos.
import getPool from './getPool.js';

// Importamos las variables de entorno que necesitamos para crear el admin
const {
    ADMIN_USER_USERNAME,
    ADMIN_USER_EMAIL,
    ADMIN_USER_PASSWORD,
    ADMIN_USER_NAME,
    ADMIN_USER_LASTNAME,
    ADMIN_USER_ROLE,
    ADMIN_USER_ACTIVE,
} = process.env;

// Función que genera las tablas.
const main = async () => {
    try {
        // Obtenemos una conexión con la base de datos.
        const pool = await getPool();

        console.log('Borrando tablas...');

        // Borramos las tablas.
        await pool.query(
            'DROP TABLE IF EXISTS users, offices, equipments, officesEquipments, officePhotos, bookings',
        );

        console.log('Creando tablas...');

        // Creamos la tabla de usuarios.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL ,
                lastName VARCHAR(255)NOT NULL,
                avatar VARCHAR(255),
                role ENUM('CLIENT', 'ADMIN') DEFAULT 'CLIENT',
                active BOOLEAN DEFAULT FALSE, 
                registrationCode CHAR(50),
                recoverPassCode CHAR(50),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `);

        // Creamos la tabla de oficinas.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS offices (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                workspace ENUM ("OFFICE", "DESK"),
                capacity INT UNSIGNED NOT NULL,
                opening TIME NOT NULL DEFAULT '08:00',
                closing TIME NOT NULL DEFAULT '21:00',
                price DECIMAL(10, 2) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `);

        // Creamos tabla Equipamientos
        await pool.query(`
            CREATE TABLE IF NOT EXISTS equipments (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
         )
         `);

        //Creamos tabla de Equipamiento de oficina
        await pool.query(`
            CREATE TABLE IF NOT EXISTS officesEquipments (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idOffice INT UNSIGNED,
                    FOREIGN KEY (idOffice) REFERENCES offices(id),
                idEquipment INT UNSIGNED,
                    FOREIGN KEY (idEquipment) REFERENCES equipments(id),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP    
            )
          `);

        // Tabla de fotos.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS officePhotos (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idOffice INT UNSIGNED NOT NULL,
                    FOREIGN KEY(idOffice) REFERENCES offices(id),
                name VARCHAR(100) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Creamos la tabla de Reservas.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT ,
                idUser INT UNSIGNED,
                    FOREIGN KEY (idUser) REFERENCES users(id),
                idOffice INT UNSIGNED,
                    FOREIGN KEY (idOffice) REFERENCES offices(id),
                checkIn DATETIME NOT NULL,
                checkOut DATETIME NOT NULL,
                guests INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                status ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELED') DEFAULT 'PENDING',
                vote TINYINT UNSIGNED DEFAULT 0,
                comment VARCHAR(255),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP                    
            )
            `);

        console.log('¡Tablas creadas!');

        console.log('Creando Usuario administrador...');
        const hashedAdminPass = await bcrypt.hash(ADMIN_USER_PASSWORD, 10);
        await pool.query(
            `INSERT INTO users(email, username, password, name, lastname, role, active)
            VALUES ("${ADMIN_USER_EMAIL}", "${ADMIN_USER_USERNAME}", ?, "${ADMIN_USER_NAME}", "${ADMIN_USER_LASTNAME}", "ADMIN", TRUE)`,
            [hashedAdminPass],
        );
        console.log('¡Administrador creado!');

        console.log('Insertamos equipamientos...');
        await pool.query(`
            INSERT INTO equipments (name) VALUES
                ("Pizarra"), ("Proyector"), ("Catering"), ("Cafetera"), ("Monitor"), ("Equipo de sonido"), ("TV"), ("Dispensador de Agua")
            `);
        console.log('¡Equipamientos añadidos!');

        // Cerramos el proceso con código 0 indicando que todo ha ido bien.
        process.exit(0);
    } catch (err) {
        console.error(err);

        // Cerramos el proceso con código 1 indicando que hubo un error.
        process.exit(1);
    }
};

// Llamamos a la función anterior.
main();
