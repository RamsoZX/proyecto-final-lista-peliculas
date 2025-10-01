# 🎬 Mi Lista de Películas (CRUD con React y Firebase Firestore)

Este proyecto es una aplicación web interactiva desarrollada en **React** y **Vite** que permite a los usuarios gestionar su propia lista de películas favoritas, aplicando todas las operaciones fundamentales de una base de datos: **CRUD** (Crear, Leer, Actualizar y Eliminar).

La persistencia de los datos se maneja completamente con **Firebase Firestore** como servicio Backend-as-a-Service (BaaS).

---

## ⚙️ Tecnologías Utilizadas

* **Frontend:** React (con Hooks)
* **Gestión de Estado:** React Hook Form (para manejo y validación de formularios)
* **Estilos:** React-Bootstrap y CSS personalizado (para un diseño moderno y responsive)
* **Enrutamiento:** React Router DOM (para la navegación entre vistas)
* **Backend (BaaS):** Firebase Firestore (como base de datos NoSQL)
* **Despliegue:** Vercel

---

## ✨ Características Principales

* **Listado (READ):** Muestra todas las películas almacenadas en Firestore.
* **Creación (CREATE):** Formulario para añadir nuevas películas con validación en tiempo real.
* **Detalle:** Vista individual para cada película.
* **Edición (UPDATE):** Funcionalidad completa para modificar los datos de una película existente.
* **Eliminación (DELETE):** Opción para borrar una película de la base de datos.
* **Experiencia de Usuario:** Vistas estilizadas y coherentes, con estados de carga (Loading) optimizados.

---

## 🚀 Ejecución Local

Para poner en marcha esta aplicación en tu entorno de desarrollo local, sigue estos pasos:

### 1. Clonar el Repositorio

```bash
git clone [https://github.com/RamsoZX/proyecto-final-lista-peliculas.git](https://github.com/RamsoZX/proyecto-final-lista-peliculas.git)
cd proyecto-final-lista-peliculas
```
### 2. Instalación de Dependencias
Instala todas las librerías necesarias (React, Firebase, React-Bootstrap, etc.):
npm install

### 3. Configuración de Firebase (Variables de Entorno)
Crea un archivo llamado .env en la raíz del proyecto y añade tus credenciales de configuración de Firebase (obtenidas desde la consola de Firebase):

### 4. Iniciar la Aplicación
Ejecuta el servidor de desarrollo de Vite:
npm run dev

La aplicación se abrirá en tu navegador, generalmente en http://localhost:5173.

