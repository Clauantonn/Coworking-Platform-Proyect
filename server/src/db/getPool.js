import 'dotenv/config';

import mysql from 'mysql2/promise';

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

let pool;

const getPool = async () => {
    try {
        if (!pool) {
            // Creamos un pool temporal.
            pool = mysql.createPool({
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS,
                timezone: 'Z',
            });

            // Con la conexión anterior creamos la base de datos si no existe.
            await pool.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DB}`);

            // Creamos el pool definitivo.
            pool = mysql.createPool({
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS,
                database: MYSQL_DB,
                timezone: 'Z',
            });
        }

        return await pool;
    } catch (err) {
        console.error(err);
    }
};
export default getPool;
