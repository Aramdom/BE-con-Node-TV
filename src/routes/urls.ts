import { Router, Request, Response } from 'express';

const router = Router();

export interface ShortUrl {
  id: string;
  ownerEmail: string;
  originalUrl: string;
  shortCode: string;
  isActive: boolean;
  createdAt: string;
}

// In-memory database of shortened URLs
export const shortUrls: ShortUrl[] = [];

// Helper to generate a random 6-character alfanumeric string
const generateShortCode = (length = 6): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Helper to ensure a URL starts with http:// or https://
 */
const formatUrl = (url: string): string => {
  if (!/^https?:\/\//i.test(url)) {
    return 'http://' + url;
  }
  return url;
};

/**
 * 4. Registro de URL (Acortar URL)
 * POST /api/urls/shorten
 * DTO: email, originalUrl
 */
router.post('/shorten', (req: Request, res: Response) => {
  const { email, originalUrl } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'El correo electrónico del propietario es obligatorio.'
    });
  }

  if (!originalUrl || originalUrl.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'La URL original es obligatoria.'
    });
  }

  const formattedOriginalUrl = formatUrl(originalUrl.trim());

  // COLLISION AVOIDANCE LOOP (Garantiza código corto único)
  let shortCode = '';
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 100) {
    shortCode = generateShortCode(6);
    // Verificamos si ya existe el shortCode en memoria para evitar colisión de hash
    isUnique = !shortUrls.some(u => u.shortCode === shortCode);
    attempts++;
  }

  if (!isUnique) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'No se pudo generar un código único de URL corta. Inténtalo de nuevo.'
    });
  }

  const newUrl: ShortUrl = {
    id: Math.floor(1000 + Math.random() * 9000).toString(), // ID aleatorio de 4 dígitos
    ownerEmail: email.trim().toLowerCase(),
    originalUrl: formattedOriginalUrl,
    shortCode,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  shortUrls.push(newUrl);

  console.log(`===================================================`);
  console.log(`🔗 [ACORTADOR] URL Registrada: ${formattedOriginalUrl} -> /url/${shortCode}`);
  console.log(`===================================================`);

  res.status(201).json({
    success: true,
    message: 'URL acortada exitosamente.',
    data: newUrl
  });
});

/**
 * 6. Desactivar URL
 * POST /api/urls/deactivate
 * DTO: id
 */
router.post('/deactivate', (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'El ID de la URL es obligatorio.'
    });
  }

  const urlEntry = shortUrls.find(u => u.id === id.toString());

  if (!urlEntry) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `No se encontró ninguna URL con el ID ${id}.`
    });
  }

  urlEntry.isActive = false;

  console.log(`🔴 [ACORTADOR] URL Desactivada: ID ${id} (/url/${urlEntry.shortCode})`);

  res.status(200).json({
    success: true,
    message: 'URL desactivada exitosamente.',
    data: urlEntry
  });
});

/**
 * 7. Activar URL
 * POST /api/urls/activate
 * DTO: id
 */
router.post('/activate', (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'El ID de la URL es obligatorio.'
    });
  }

  const urlEntry = shortUrls.find(u => u.id === id.toString());

  if (!urlEntry) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `No se encontró ninguna URL con el ID ${id}.`
    });
  }

  urlEntry.isActive = true;

  console.log(`🟢 [ACORTADOR] URL Activada: ID ${id} (/url/${urlEntry.shortCode})`);

  res.status(200).json({
    success: true,
    message: 'URL activada exitosamente.',
    data: urlEntry
  });
});

/**
 * Auxiliar: Listar URLs de un usuario
 * GET /api/urls/list?email=...
 */
router.get('/list', (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'El correo electrónico es requerido.'
    });
  }

  const userUrls = shortUrls.filter(u => u.ownerEmail === (email as string).trim().toLowerCase());

  res.status(200).json({
    success: true,
    count: userUrls.length,
    data: userUrls
  });
});

export default router;
