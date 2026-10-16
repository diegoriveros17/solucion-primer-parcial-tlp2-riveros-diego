# Primer Parcial – Sistema de Gestión de Proyectos de Software (Base)

API REST con Node.js, Express y Sequelize/MySQL.

## Instalación

1. `npm install`
2. Copiar `.env.example` a `.env` y completar los valores.
3. Crear la base de datos en MySQL (`DB_NAME`).
4. `npm run dev`

## Endpoints

### Auth

Método: POST
Ruta:`/api/auth/register`
Acceso: público

Método: POST
Ruta:`/api/auth/login`
Acceso: público

Método: POST
Ruta:`/api/auth/logout`
Acceso: sesión iniciada

### Projects

Método: POST
Ruta:`/api/projects`
Acceso: sesión iniciada

Método: GET
Ruta:`/api/projects`
Acceso: administrator

Método: GET
Ruta:`/api/projects/my-projects`
Acceso: sesión iniciada

Método: PUT
Ruta:`/api/projects/:id`
Acceso: líder del proyecto

Método: DELETE
Ruta:`/api/projects/:id`
Acceso: líder del proyecto

### Users

Método: GET
Ruta:`/api/users`
Acceso: administrator

Método: DELETE
Ruta:`/api/users/:id`
Acceso: administrator

### Technologies

Método: POST
Ruta:`/api/technologies`
Acceso: administrator

Método: GET
Ruta:`/api/technologies`
Acceso: sesión iniciada

Método: DELETE
Ruta:`/api/technologies/:id`
Acceso: administrator
