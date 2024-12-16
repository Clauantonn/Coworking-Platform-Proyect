# end points de usuarios no registrados (✅) ( ? )

? - **POST** - [`/users/register`] - Crea un nuevo usuario pendiente de activar.
? - **PUT** - [`'/users/activate/:registrationCode`] - Registro (con envío e-mail de validación)

? - \*\* ** - [`/offices/filterSpace`] - filtro de spaces ( name, description, address ..)
? - ** ** - [`/offices/equipmentList`] - equipamiento disponible (mesas, sillas, pantalla, ...)
? - ** \*\* - [`/offices/passwordRecovery`] - Login con enlace de recuperación contraseña

# end points de usuarios registrados (✅) ( ? )

? - **GET** - [`/users/homePage`] - visualizar la landing con el listado de espacios
? - **PUT** - [`/users/profile`] - Gestión del perfil (edición de datos: email,username,name,last,namepassword,avatar)
? - **GET** - [`/users/spaceBooked`] - Listado reservas

? - \*\* ** - [`/offices/filterSpace`] - filtro de spaces ( name, description, address ..)
? - \*\* ** - [`/offices/spaceinfo`] - Acceder a la ficha del espacio con todos los detalles
? - \*\* ** - [`/offices/spaceBooking`] - Reservar (una plaza o todo)
? - \*\* ** - [`/offices/cancelSpaceBooking`] - Cancelar una reserva hasta el día anterior
? - \*\* ** - [`/offices/incidentChat`] - Reporte de incidencia sobre espacio: (Categoría incidencia Descripción)
? - \*\* ** - [`/offices/spaceRating`] - Rating del espacio después de su utilizo (desde 1 a 5)

# end points de usuarios ADMIN (✅) ( ? )

? - **GET** - [`/users/homePage`] - visualizar la landing con el listado de espacios
? - \*\* ** - [`/offices/filterSpace`] - filtro de spaces ( name, description, address ..)
? - \*\* ** - [`/offices/spaceinfo`] - Acceder a la ficha del espacio con todos los detalles
? - **PUT** - [`/users/profile`] - Gestión del perfil (edición de datos: email,username,name,last,namepassword,avatar)

? - **PUT** - [[`/offices/CreateSpaces`]] - La plataforma permitirá introducir la información y actualización necesaria sobre los
espacios de coworking (nombre, descripción, foto, dirección, equipamiento, tipo
espacio, capacidad, precio por persona, precio alquiler totalidad espacio ... ).

? - **GET** - [`/users/spaceBooked`] -Ver el Listado de las reservas
? - \*\* ** - [`/offices/bookingAproval`] -Confirmar o rechazar las reservas (con envío email)
? - \*\* ** - [`/offices/incidentChat`] - Gestion de incidencia sobre espacio:
