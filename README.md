# Coworking

Portal donde publicar espacios de coworking, reservar y gestionar cada espacio.

## Instalar

1. Instalar las dependencias mediante el comando `npm install` o `npm i`.

2. Guardar el archivo `.env.example` como `.env` y cubrir los datos necesarios.

3. Ejecutar `npm run initdb` para crear las tablas necesarias en la base de datos.

4. Ejecutar `npm run dev` para lanzar el servidor.

## Base de datos

### users

| Campo            | Tipo         | Descripción                           |
| ---------------- | ------------ | ------------------------------------- |
| id               | INT UNSIGNED | Identificador único del usuario       |
| email            | VARCHAR(255) | Correo electrónico del usuario        |
| username         | VARCHAR(255) | Nombre de usuario del usuario         |
| password         | VARCHAR(255) | Contraseña del usuario (hash)         |
| avatar           | VARCHAR(255) | URL del avatar del usuario            |
| role             | ENUM         | Rol del usuario ("CLIENT" o "ADMIN")  |
| active           | BOOLEAN      | Usuario activado o no (DEFAULT FALSE) |
| registrationCode | CHAR(50)     | Codigo de registro                    |
| recoverPassCode  | CHAR(50)     | Codigo de recuperacion de contraseña  |
| createdAt        | DATETIME     | Fecha y hora de creación del usuario  |

### offices

| Campo       | Tipo          | Descripción                            |
| ----------- | ------------- | -------------------------------------- |
| id          | INT UNSIGNED  | Identificador único de la entrada      |
| name        | VARCHAR(255)  | Nombre de la oficina                   |
| description | VARCHAR(255)  | Descripción de la oficina              |
| adress      | VARCHAR(255)  | Direccion de la oficina                |
| workspace   | ENUM          | Tipo de oficina("OFFICE" o "DESK")     |
| capacity    | INT UNSIGNED  | Capacidad                              |
| price       | DECIMAL(10,2) | Precio del workspace                   |
| createdAt   | DATETIME      | Fecha y hora de creación de la entrada |

### equipments

| Campo     | Tipo         | Descripción                         |
| --------- | ------------ | ----------------------------------- |
| id        | INT UNSIGNED | Identificador único de la entrada   |
| name      | VARCHAR(255) | Nombre del equipamiento             |
| createdAt | DATETIME     | Fecha y hora de creación de la foto |

### officesEquipments

| Campo       | Tipo         | Descripción                        |
| ----------- | ------------ | ---------------------------------- |
| id          | INT UNSIGNED | Identificador único de la entrada  |
| idOffice    | INT UNSIGNED | Identificador de la entrada votada |
| idEquipment | INT UNSIGNED | Identificador del usuario que votó |
| createdAt   | DATETIME     | Fecha y hora de creación del voto  |

### officePhotos

| Campo     | Tipo         | Descripción                                            |
| --------- | ------------ | ------------------------------------------------------ |
| id        | INT UNSIGNED | Identificador único de la foto                         |
| idOffice  | INT UNSIGNED | Identificador de la entrada a la que pertenece la foto |
| name      | VARCHAR(255) | Nombre de la foto                                      |
| createdAt | DATETIME     | Fecha y hora de creación de la foto                    |

### bookings

| Campo     | Tipo         | Descripción                            |
| --------- | ------------ | -------------------------------------- |
| id        | INT UNSIGNED | Identificador único de la reserva      |
| idUser    | INT UNSIGNED | Identificador único del usuario        |
| idOffice  | INT UNSIGNED | Identificador de la oficina            |
| checkIn   | DATETIME     | Hora de entrada                        |
| checkOut  | DATETIME     | Hora de salida                         |
| guest     | INT          | Numero de usuario                      |
| vote      | TINYINT      | Calificacion dada                      |
| comment   | VARCHAR(255) | Comentario sobre la reserva            |
| createdAt | DATETIME     | Fecha y hora de creación de la entrada |

## Endpoints del usuario

- **POST** - [`/users/register`] - Crea un nuevo usuario pendiente de activar. ✅
- **PATCH** - [`/users/activate/:registrationCode`] - Activa a un usuario mediante un código de registro. ✅
- **POST** - [`/users/login`] - Logea a un usuario retornando un token. ✅
- **GET** - [`/users/profile`] - Retorna información privada del usuario con el id del token. ✅
- **PATCH** - [`/users/editProfile`] - Permite actualizar el perfil del usuario. ✅
- **PATCH** - [`/users/avatar`] - Permite actualizar el avatar del usuario. ✅
- **GET** - [`/users/bookingsList`] - Retorna las reservas del usuario. ✅
- **PUT** - [`/users/password/recover`] - Permite enviar un email de recuperación de contraseña. ✅
- **PUT** - [`/users/password/reset/:recoverPassCode`] - Permite crear una nueva contraseña a partir de un código. ✅

## Endpoints de las oficinas

- **POST** - [`/office/create`] - Crea una oficina. ✅
- **PUT** - [`/office/edit/:idOffice`] - Permite editar una oficina. ✅
- **GET** - [`/office/list`] - Retorna el listado de oficinas. ✅
- **GET** - [`/office/equipments`] - Retorna los equipamientos filtrados con una palabra clave. ✅
- **GET** - [`/office/:idOffice`] - Retorna una oficina en concreto por ID. ✅
- **GET** - [`/office/:idOffice/equipments`] - Retorna los equipamientos de una oficina. ✅
- **POST** - [`/office/:idOffice/booking`] - Permite reservar una oficina por ID. ✅
- **PUT** - [`/office/:idOffice/booking/:idBooking`] - Permite al admin administrar las reservas.✅
- **DELETE** - [`/office/:idOffice`] - Permite eliminar una oficina en concreto por ID. ✅
- **DELETE** - [`/office/:idBooking/booking`] - Elimina una reserva. ✅
- **PUT** - [`/office/:idOffice/:idBooking`] - Vota una oficina mediante una reserva (entre 1 y 5). ✅
