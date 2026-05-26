# Trabajos y actividades BE con Node TV

Este repositorio contiene dos proyectos backend desarrollados en Node.js y Express utilizando TypeScript:
1. Trabajo 1: Secure CRUD API (gestión de usuarios protegida por cabeceras de seguridad).
2. Trabajo 2: Autenticación y Acortador de URLs (sistema de registro, login con hash bcryptjs y acortador de enlaces con colisión cero).

Ambos proyectos se encuentran integrados y listos para interactuar en una interfaz web unificada de tipo portafolio.

---

## Requisitos Previos

Para ejecutar esta aplicación, asegúrese de tener instalado y activo en su sistema operativo:
* Docker Desktop

---

## Instrucciones de Ejecución

Siga estos sencillos pasos para compilar y desplegar los proyectos en su entorno local:

1. Abra una terminal en el directorio del proyecto (`BE-con-Node-TV`).
2. Compile e inicie el contenedor de Docker ejecutando el siguiente comando:
   ```bash
   docker compose up --build -d
   ```
3. Una vez que la terminal indique que el contenedor ha iniciado, abra su navegador web favorito y acceda a la siguiente dirección:
   ```text
   http://localhost:3000
   ```

---

## Estructura de la Interfaz

La aplicación utiliza un menú de navegación lateral para interactuar de manera independiente con cada trabajo:

* **Mi Portafolio:** Vista de presentación inicial de los proyectos y actividades.
* **Trabajo 1: Secure CRUD:** Panel para gestionar usuarios en memoria. Este módulo requiere enviar credenciales específicas en las cabeceras HTTP de las peticiones para validar accesos (simulado en el panel interactivo).
* **Trabajo 2: Acortador de URLs:** Panel que incluye un flujo completo de registro, verificación por código e inicio de sesión. Una vez autenticado, permite acortar enlaces originales y gestionar su estado (activación o desactivación de redirecciones).

---

## Comandos Útiles de Administración

* **Ver los registros (logs) del servidor en tiempo real:**
  ```bash
  docker compose logs -f
  ```
* **Detener la aplicación y liberar los puertos:**
  ```bash
  docker compose down
  ```
