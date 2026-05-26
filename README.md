# Proyecto de clase WEB


## Midlewares de Seguridad

Para poder interactuar exitosamente con la API, se deben enviar las siguientes cabeceras HTTP:

1. Autorización Global (Todos los métodos):
   - Cabecera: `Authorization`
   - Valor requerido: `fha5HpDXSXSjKU0QCbdXiz1a`
   - *Si no se envía o es incorrecto, el servidor responderá con un código `401 Unauthorized`.*

2. **Cabecera Especial para Operaciones de Escritura (POST, PUT, DELETE)**:
   - Cabecera: `token`
   - Valor requerido: `HIZe4D32twWOUP9h0I1IVTlr`
   - *Si se realiza una petición no-GET y esta cabecera no está presente o no coincide, el servidor responderá con un código `403 Forbidden`.*

---

# Estructura del Código

El proyecto está diseñado de forma modular y mantenible:
- `src/server.js`: Punto de entrada que inicializa el puerto y maneja apagados limpios.
- `src/app.js`: Configura los middlewares globales e integra el enrutador.
- `src/middleware/auth.js`: Contiene las funciones middlewares de validación de credenciales.
- `src/routes/users.js`: Define el CRUD de usuarios con validaciones de cuerpo y almacenamiento temporal.

---

## 🛠️ Instalación y Uso Local

Sigue estos pasos para levantar la API en tu entorno local:

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar en Modo de Desarrollo** (con recarga automática mediante `nodemon`):
   ```bash
   npm run dev
   ```

3. **Iniciar en Modo de Producción**:
   ```bash
   npm start
   ```

El servidor estará escuchando en la dirección: `http://localhost:3000`

---

## Guía de Endpoints y Ejemplos de Pruebas (cURL)

A continuación se detallan los endpoints del CRUD de usuarios y los comandos `cURL` exactos para probarlos:

### 1. Listar Usuarios (GET)
Obtiene todos los usuarios de la base de datos temporal.
- **Ruta**: `/api/users`
- **Cabeceras requeridas**:
  - `Authorization: fha5HpDXSXSjKU0QCbdXiz1a`

**Ejemplo de Comando:**
```bash
curl -i -H "Authorization: fha5HpDXSXSjKU0QCbdXiz1a" http://localhost:3000/api/users
```

---

### 2. Obtener un Usuario por ID (GET)
Busca y retorna la información de un usuario específico.
- **Ruta**: `/api/users/:id`
- **Cabeceras requeridas**:
  - `Authorization: fha5HpDXSXSjKU0QCbdXiz1a`

**Ejemplo de Comando (para ID 1):**
```bash
curl -i -H "Authorization: fha5HpDXSXSjKU0QCbdXiz1a" http://localhost:3000/api/users/1
```

---

### 3. Crear un Usuario (POST)
Registra un nuevo usuario en memoria con validaciones de campos y correo.
- **Ruta**: `/api/users`
- **Cabeceras requeridas**:
  - `Authorization: fha5HpDXSXSjKU0QCbdXiz1a`
  - `token: HIZe4D32twWOUP9h0I1IVTlr`
  - `Content-Type: application/json`

**Cuerpo de Petición (JSON):**
```json
{
  "name": "Grace Hopper",
  "email": "grace.hopper@example.com",
  "role": "Computer Scientist"
}
```

**Ejemplo de Comando:**
```bash
curl -i -X POST -H "Authorization: fha5HpDXSXSjKU0QCbdXiz1a" \
  -H "token: HIZe4D32twWOUP9h0I1IVTlr" \
  -H "Content-Type: application/json" \
  -d '{"name": "Grace Hopper", "email": "grace.hopper@example.com", "role": "Computer Scientist"}' \
  http://localhost:3000/api/users
```

---

### 4. Actualizar un Usuario (PUT)
Actualiza de manera parcial los datos de un usuario existente.
- **Ruta**: `/api/users/:id`
- **Cabeceras requeridas**:
  - `Authorization: fha5HpDXSXSjKU0QCbdXiz1a`
  - `token: HIZe4D32twWOUP9h0I1IVTlr`
  - `Content-Type: application/json`

**Cuerpo de Petición (JSON):**
```json
{
  "name": "Grace Brewster Murray Hopper",
  "role": "Rear Admiral"
}
```

**Ejemplo de Comando (para ID 3):**
```bash
curl -i -X PUT -H "Authorization: fha5HpDXSXSjKU0QCbdXiz1a" \
  -H "token: HIZe4D32twWOUP9h0I1IVTlr" \
  -H "Content-Type: application/json" \
  -d '{"name": "Grace Brewster Murray Hopper", "role": "Rear Admiral"}' \
  http://localhost:3000/api/users/3
```

---

### 5. Eliminar un Usuario (DELETE)
Remueve permanentemente un usuario de la lista.
- **Ruta**: `/api/users/:id`
- **Cabeceras requeridas**:
  - `Authorization: fha5HpDXSXSjKU0QCbdXiz1a`
  - `token: HIZe4D32twWOUP9h0I1IVTlr`

**Ejemplo de Comando (para ID 2):**
```bash
curl -i -X DELETE -H "Authorization: fha5HpDXSXSjKU0QCbdXiz1a" \
  -H "token: HIZe4D32twWOUP9h0I1IVTlr" \
  http://localhost:3000/api/users/2
```

---

## Pruebas de Flujos de Error

### Fallo de Middleware Global (Sin Authorization):
```bash
curl -i http://localhost:3000/api/users
# Retornará: HTTP/1.1 401 Unauthorized
```

### Fallo de Middleware de Escritura (POST sin Token):
```bash
curl -i -X POST -H "Authorization: fha5HpDXSXSjKU0QCbdXiz1a" \
  -H "Content-Type: application/json" \
  -d '{"name": "Prueba", "email": "test@test.com"}' \
  http://localhost:3000/api/users
# Retornará: HTTP/1.1 403 Forbidden
```
