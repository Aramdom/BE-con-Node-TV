import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

const router = Router();

export interface AuthUser {
  email: string;
  passwordHash: string;
  isVerified: boolean;
  verificationCode: string;
}

// In-memory database of registered users
export const authUsers: AuthUser[] = [];

// Helper to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 1. Registro de Usuario
 * POST /api/auth/register
 * DTO: email, password
 */
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation
  if (!email || email.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'El correo electrónico es obligatorio.'
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Por favor, proporciona un correo electrónico válido.'
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'La contraseña debe tener al menos 6 caracteres.'
    });
  }

  // Check if email already exists
  const emailExists = authUsers.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (emailExists) {
    return res.status(400).json({
      success: false,
      error: 'Conflict',
      message: `El correo electrónico ${email} ya está registrado.`
    });
  }

  try {
    // Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate random 6-digit numeric verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser: AuthUser = {
      email: email.trim().toLowerCase(),
      passwordHash,
      isVerified: false,
      verificationCode
    };

    authUsers.push(newUser);

    // Print verification code in system logs for debugging/dev purposes
    console.log(`===================================================`);
    console.log(`📩 [VERIFICACIÓN] Código generado para ${newUser.email}: ${verificationCode}`);
    console.log(`===================================================`);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado con éxito. Se ha generado un código de verificación.',
      data: {
        email: newUser.email,
        isVerified: newUser.isVerified,
        // We return the code so the UI can auto-fill or display it easily for convenience
        verificationCode: newUser.verificationCode
      }
    });
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Error al procesar el registro.'
    });
  }
});

/**
 * 2. Iniciar sesión
 * POST /api/auth/login
 * DTO: email, password
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Correo electrónico y contraseña son obligatorios.'
    });
  }

  const user = authUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Correo electrónico o contraseña incorrectos.'
    });
  }

  try {
    // Verify password match
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Correo electrónico o contraseña incorrectos.'
      });
    }

    // Verify if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Tu cuenta no está verificada. Por favor, completa la verificación.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      data: {
        email: user.email,
        isValid: true
      }
    });
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Error al procesar el inicio de sesión.'
    });
  }
});

/**
 * 3. Verificación de usuario
 * POST /api/auth/verify
 * DTO: email, code
 */
router.post('/verify', (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'El correo electrónico y el código son obligatorios.'
    });
  }

  const user = authUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `El usuario con correo ${email} no está registrado.`
    });
  }

  if (user.verificationCode !== code.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Código de verificación incorrecto.'
    });
  }

  user.isVerified = true;

  res.status(200).json({
    success: true,
    message: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.',
    data: {
      email: user.email,
      isVerified: true
    }
  });
});

export default router;
