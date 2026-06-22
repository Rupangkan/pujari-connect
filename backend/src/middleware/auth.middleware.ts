import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';
import { verifyToken } from '../utils/helpers.js';
import { AppError } from './error.middleware.js';

/**
 * JWT authentication middleware.
 * Extracts the Bearer token from the Authorization header,
 * verifies it, and attaches the user payload to the request.
 */
export function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Please provide a valid Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Authentication required. Token is missing.', 401);
    }

    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(new AppError('Invalid or expired token. Please login again.', 401));
  }
}

/**
 * Role-based authorization middleware.
 * Must be used AFTER the authenticate middleware.
 */
export function authorize(...roles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required.', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError('You do not have permission to perform this action.', 403));
      return;
    }

    next();
  };
}
