# Te busco
Versión en español más abajo / Spanish version below

A web application that connects special transport drivers with users who need transportation services, especially people with disabilities or chronic patients who need to attend health or rehabilitation centers.

# Demo online: 
- Passengers: 
- Drivers: 

You can freely sign up as a passenger or as a driver to try out the application.

## About

te busco was created to facilitate access to special transportation, simply connecting people who need to get somewhere (for example, to a rehabilitation center) with drivers qualified to provide this kind of service. The platform allows managing transport requests, schedule availability, reviews, and direct contact between both parties.

Built end to end: API design, MongoDB data modeling, middlewares, validations, authentication, and the full frontend in React.

## Feautures

Users(passengers)
- Sign up, log in / log out
- Password recovery
- Browse all registered drivers
- View each driver's profile
- Contact via WhatsApp
- Review system: post (with star rating and comment), edit, and delete
- Search drivers by name or health insurance provider
- Manage own profile: edit info, profile picture, email, and password
- Create transport requests (pickup address, destination, days, and times)
- Edit transport requests
- Indicate accessibility needs once a transport request is created

Drivers:
- Sign up, log in / log out
- Password recovery
- View the day's scheduled trips
- Add new trips
- View unassigned transport requests created by users
- Filter requests by own availability
- Access the requesting user's profile and contact via WhatsApp
- Manage own profile: edit info, profile picture, email, and password
- Add, view, and delete availability (days and times)
- Add vehicle information (including whether it's wheelchair accessible / has a ramp)

## Technologies

Frontend

- HTML5, CSS3, JavaScript
- React.js
- Tailwind CSS
- Material UI (MUI) + Icons
- React Hook Form + Yup (forms and validation)
- React Router DOM
- Emotion (CSS-in-JS for MUI)
- Date-fns / Day.js
- Framer Motion (animations)
- React Select
- React Phone Input 2 + Libphonenumber-js
- Js-cookie
- Classnames
- React Ripples

Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT (authentication)
- Bcrypt (password hashing)
- Yup (server-side validation)
- Dotenv
- Multer + Cloudinary (file upload and storage)
- Nodemailer (email sending)
- Luxon (dates)
- Sharp (image processing)
- EJS (server-side views, e.g. password recovery email)
- Libphonenumber-js (phone validation)

Development tools
- Nodemon

## Project structure

api/         -> API controllers and routes
data/        -> JSON files with initial MongoDB collections
middlewares/ -> Authentication, roles, error handling, images, etc.
public/      -> Static files
schemas/     -> Validation schemas (Yup)
services/    -> Business logic and data access
templates/   -> HTML templates (e.g. password recovery email)
tebusco/     -> Frontend source code (React)
.app.js      -> Server entry point
database.js  -> Initial data seeding script for MongoDB
README.md

## Third-party services

This project uses HERE's geolocation services for:

- Address autocomplete when creating a transport request
- Geocoding (address → coordinates)
- Reverse geocoding (coordinates → address)

### Project status

Current version: 1.0
Planned future features include internal messaging (chat) between users and drivers.

### Authorship

Developed by Julieta Natalí Soler

### License

All rights reserved. This project constitutes an unpublished work and its use, copying, distribution, or modification is not authorized without the express permission of its author.

________________________________________

es Español 

Aplicación web que conecta conductores de transporte especial con usuarios que requieren del servicio de traslado, especialmente personas con discapacidad o pacientes crónicos que necesitan asistir a centros de salud o rehabilitación.

# Demo online: 
- Pasajeros: 
- Conductores: 

Podés registrarte libremente como pasajero o como conductor para probar la aplicación. 

# Sobre el proyecto

te busco nace para facilitar el acceso al transporte especial, conectando de forma simple a quienes necesitan trasladarse con conductores habilitados para este tipo de servicio. La plataforma permite gestionar solicitudes de traslado, disponibilidad horaria, reseñas y contacto directo entre ambas partes.

Desarrollado de punta a punta: diseño de la API, modelado de datos en MongoDB, middlewares, validaciones, autenticación y el frontend completo en React.

## Funcionalidades

Usuarios (pasajeros)
- Registro, inicio y cierre de sesión
- Recuperación de contraseña
- Visualización de todos los conductores registrados
- Acceso al perfil de cada conductor
- Contacto directo por WhatsApp
- Sistema de reseñas: publicar, editar y eliminar
- Búsqueda de conductores por nombre o prepaga
- Gestión de perfil propio: editar datos, foto de perfil, email y contraseña
- Creación de solicitudes de traslado (docimicilio de retiro, destino, días y horarios)
- Edición de solicitudes de traslado
- Indicación de necesidades especiales de accesibilidad en la solicitud

Conductores:
- Registro, inicio y cierre de sesión
- Recuperación de contraseña
- Visualización de traslados del día
- Alta de nuevos traslados
- Visualización de solicitudes de traslado no asignadas
- Filtrado de solicitudes según disponibilidad propia
- Acceso al perfil del usuario solicitante y contacto por WhatsApp
- Gestión de perfil propio: editar datos, foto de perfil, email y contraseña
- Carga, visualización y eliminación de disponibilidad horaria
- Carga de información del vehículo (incluye si está adaptado con rampa y/o para silla de ruedas)

## Tecnologías

Frontend:
- HTML5, CSS3, JavaScript
- React.js
- Tailwind CSS
- Material UI (MUI) + Icons
- React Hook Form + Yup (formularios y validación)
- React Router DOM
- Emotion (estilos en JS para MUI)
- Date-fns/Day.js
- Framer Motion (animaciones)
- React Select
- React Phone Input 2 + Libphonenumber-js
- Js-cookie
- Classnames
- React Ripples

Backend: 
- Node.js + Express
- MongoDB 
- JWT (autenticación)
- Bcrypt (hash de contraseñas)
- Yup (validación server-side)
- Dotenv
- Multer + Cloudinary (carga y almacenamiento de archivos)
- Nodemailer (envío de emails)
- Luxon (fechas)
- Sharp (procesamiento de imágenes)
- EJS (vistas server-side, ej. email de recuperación de clave)
- Libphonenumber-js (validación de teléfonos)

Herramientas de desarrollo:
- Nodemon

## Estructura del proyecto

api/         -> Controladores y rutas de la API
data/        -> JSON con colecciones iniciales para MongoDB
middlewares/ -> Autenticación, roles, manejo de errores, imágenes, etc.
public/      -> Archivos estáticos
schemas/     -> Esquemas de validación (Yup)
services/    -> Lógica de negocio y acceso a datos
templates/   -> Plantillas HTML (ej. email de recuperación de clave)
tebusco/     -> Código fuente del frontend (React)
.app.js      -> Entry point del servidor
database.js  -> Script de carga inicial de datos a MongoDB
README.md

## Servicios de terceros

Se utiliza el servicio de geolocalización de HERE para: 

- Autocompletado de direcciones al crear una solicitud de traslado. 
- Geocodificación (dirección->coordenadas)
- Geocodificación inversa (coordenadas->dirección)

## Estado del proyecto 

Versión actual: 1.0
Próximas funcionalidades previstas: mensajería interna (chat) entre usuarios y conductores.

### Autoría

Desarrollado por Julieta Natalí Soler

### Licencia

Todos los derechos reservados. Este proyecto constituye una obra inédita y no se autoriza su uso, copia, distribución o modificación sin autorización expresa de su autora. 