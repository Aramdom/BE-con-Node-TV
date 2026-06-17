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
