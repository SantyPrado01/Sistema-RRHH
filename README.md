# Sistema de RRHH 

## Descripción
Este sistema fue diseñado para una empresa en especifico de la ciudad de Cordoba, Argentina. Es un sistema de gestión de recursos humanos diseñado para optimizar la administración de empleados y empresas, horarios, categorías de servicios, ciudades y facturas. Este proyecto utiliza una arquitectura basada en Angular para el frontend y NestJS para el backend, junto con SQL para la gestión de bases de datos.

## Tecnologías Utilizadas

### Frontend
- Angular
- HTML, CSS y TypeScript

### Backend
- NestJS
- TypeScript

### Base de Datos
- SQL

## Funcionalidades

1. **Gestión de Empleados**:
   - Alta, baja y modificación de empleados.
   - Asignación y edición de horarios laborales por empleado.
   - Búsqueda de empleados con un diálogo en tiempo real.

2. **Gestión de Empresas**:
   - Alta, baja y modificacion de empresas.
   - Búsqueda de empresas con un diálogo en tiempo real.
  
3. **Gestión de Categorías**:
   - Administración de categorías relacionadas con los servicios ofrecidos por la empresa.

4. **Gestión de Órdenes de Trabajo**:
   - Creación de órdenes de trabajo.
   - Asignación de horarios basada en necesidades específicas.
     
5. **Gestión de Facturas**:
   - Alta, baja y modificacion de las facturas efectuadas.
   - Búsqueda de facturas con un diálogo en tiempo real.
     
6. **Gestión de Usuarios**:
   - Alta, baja y modificacion de Usuarios del sistema.
   - Búsqueda de usuarios con un diálogo en tiempo real.

7. **Integración con APIs Externas**:
   - Consumo de una API para obtener datos sobre ciudades de la provincia de Córdoba.

## Instalación

### Requisitos
- Node.js
- Angular CLI
- NestJS CLI
- MySQL o cualquier sistema de gestión de bases de datos compatible

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/corsacor.git
   ```
2. Configurar el backend:
   - Ingresar a la carpeta `backend`.
   - Instalar las dependencias:
     ```bash
     npm install
     ```
   - Configurar el archivo `.env` con las credenciales de la base de datos.
   - Iniciar el servidor:
     ```bash
     npm run start
     ```
3. Configurar el frontend:
   - Ingresar a la carpeta `frontend`.
   - Instalar las dependencias:
     ```bash
     npm install
     ```
   - Iniciar el servidor:
     ```bash
     ng serve
     ```

## Uso

1. Ingresar al sistema mediante el formulario de login.
2. Navegar a través de la barra de navegación para gestionar empleados, categorías, horarios y órdenes de trabajo.
3. Visualizar, filtrar y editar información según sea necesario.

## Estado del Proyecto

Este sistema está en desarrollo activo. Las funcionalidades principales están implementadas, pero se están agregando mejoras y nuevas características continuamente.

## Contribuciones

Las contribuciones son bienvenidas. Para colaborar:

1. Realiza un fork del repositorio.
2. Crea una rama para tu funcionalidad o corrección de errores:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y confirma los commits.
4. Envía un pull request.

## Autor

Santiago Prado
