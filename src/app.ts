import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireApiKey, requireWriteToken } from './middleware/auth.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import urlsRouter, { shortUrls } from './routes/urls.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

// Serve beautiful static web UI on root /
app.use(express.static(path.join(__dirname, '../public')));

// -------------------------------------------------------------------
// 5. Consulta y Redirección de URL Acortada (/url/miShortCode)
// -------------------------------------------------------------------
app.get('/url/:shortCode', (req: Request, res: Response) => {
  const { shortCode } = req.params;
  const urlEntry = shortUrls.find(u => u.shortCode === shortCode);

  if (!urlEntry) {
    // Redirigir a una página elegante de error 404
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Enlace no encontrado | Portafolio</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Inter:wght@400&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at 50% 0%, #1a153b 0%, #0d0b18 50%, #07060d 100%);
            color: #f3f4f6;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            text-align: center;
          }
          .card {
            background: rgba(20, 18, 38, 0.6);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 3rem;
            border-radius: 24px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            max-width: 450px;
          }
          h1 { font-family: 'Outfit', sans-serif; color: #ef4444; margin-bottom: 1rem; }
          p { color: #9ca3af; margin-bottom: 2rem; line-height: 1.5; }
          a {
            background: linear-gradient(135deg, #8b5cf6, #a78bfa);
            color: #white;
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>⚠️ Enlace no encontrado</h1>
          <p>El enlace corto <strong>/url/${shortCode}</strong> no está registrado en el sistema o ha sido eliminado.</p>
          <a href="/" style="color: #ffffff;">Volver al Portafolio</a>
        </div>
      </body>
      </html>
    `);
  }

  if (!urlEntry.isActive) {
    // Redirigir a una página elegante indicando que está inactiva
    return res.status(403).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Enlace Inactivo | Portafolio</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Inter:wght@400&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at 50% 0%, #1a153b 0%, #0d0b18 50%, #07060d 100%);
            color: #f3f4f6;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            text-align: center;
          }
          .card {
            background: rgba(20, 18, 38, 0.6);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 3rem;
            border-radius: 24px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            max-width: 450px;
          }
          h1 { font-family: 'Outfit', sans-serif; color: #f59e0b; margin-bottom: 1rem; }
          p { color: #9ca3af; margin-bottom: 2rem; line-height: 1.5; }
          a {
            background: linear-gradient(135deg, #8b5cf6, #a78bfa);
            color: #white;
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🔒 Enlace Desactivado</h1>
          <p>El enlace corto <strong>/url/${shortCode}</strong> está temporalmente desactivado por el propietario.</p>
          <a href="/" style="color: #ffffff;">Volver al Portafolio</a>
        </div>
      </body>
      </html>
    `);
  }

  // Redirección exitosa (302 Found)
  res.redirect(302, urlEntry.originalUrl);
});

// -------------------------------------------------------------------
// Enrutadores de las APIs
// -------------------------------------------------------------------

// Trabajo 2: Autenticación y Acortador (IGNORAN cabeceras de seguridad del crud)
app.use('/api/auth', authRouter);
app.use('/api/urls', urlsRouter);

// Trabajo 1: CRUD de Usuarios (APLICA cabeceras de seguridad)
app.use('/api/users', requireApiKey, requireWriteToken, usersRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.url} does not exist.`
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

export default app;
