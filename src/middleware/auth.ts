import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check the Authorization header.
 * Only allows requests if the Authorization header matches 'fha5HpDXSXSjKU0QCbdXiz1a'.
 */
export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization') || req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authorization header is missing.'
    });
  }

  if (authHeader !== 'fha5HpDXSXSjKU0QCbdXiz1a') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid Authorization key.'
    });
  }

  next();
};

/**
 * Middleware for non-GET methods.
 * Requires a custom header 'token' to be equal to 'HIZe4D32twWOUP9h0I1IVTlr'.
 */
export const requireWriteToken = (req: Request, res: Response, next: NextFunction) => {
  // If it's a GET request, skip this middleware
  if (req.method === 'GET') {
    return next();
  }

  const tokenHeader = req.get('token') || req.headers['token'];

  if (!tokenHeader) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: "Custom 'token' header is required for non-GET requests."
    });
  }

  if (tokenHeader !== 'HIZe4D32twWOUP9h0I1IVTlr') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: "Invalid 'token' value in header."
    });
  }

  next();
};
