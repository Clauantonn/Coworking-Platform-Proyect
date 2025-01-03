# Coworking - Cliente React

# Coworking

Portal donde publicar espacios de coworking, reservar y gestionar cada espacio.

## Instalar

1. Instalar las dependencias mediante el comando `npm install` o `npm i`.

2. Guardar el archivo `.env.example` como `.env` y cubrir los datos necesarios.

3. Ejecutar `npm run initdb` para crear las tablas necesarias en la base de datos.

4. Ejecutar `npm run dev` para lanzar el servidor.

Este proyecto es la parte del cliente para el portal de espacios de coworking.

## Características principales

● Creación de proyecto de React con Vite y estructura inicial de carpetas
● Página principal/landing con listado de espacios
● Página de registro
● Página de validación usuario
● Contexto para guardar la información del usuario logueado y su token
● Página de login. Se deberá guardar el token y la información del usuario en el contexto
● Página datos usuario con posibilidad de cambio de contraseña
● Página creación de un espacio (solo administrator)
● Página detalle espacio
● Reserva de un espacio
● Cancelación reserva
● Confirmar o rechazar una reserva (solo administrator)
● Rating espacio
● Creación de un mensaje de incidencia
● Página listado de reservas
● Página detalle reserva
● Página listado de todas las incidencias (solo administrador)
● Página "NotFound" (React Router Dom)

## Características extra

● Recuperación contraseña
● Actualización del perfil de usuario
● Actualización servicio/producto
● Filtros y ordenaciones en el listado servicio/producto

## Notas

● Feedback al usuario de los errores que devuelve la API (backend)
● Diseño responsivo (aplicar la metodología mobile first)
● Se pueden modificar y/o añadir endpoints en el backend