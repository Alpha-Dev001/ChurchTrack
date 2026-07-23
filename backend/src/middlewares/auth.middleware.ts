import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.jwtSecret) as {
            id?: string;
            email?: string;
            name?: string;
            role?: string;
        };
        (req as any).user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
    }
}

/** Attach user when a valid Bearer token is present; otherwise continue as public. */
export function optionalAuthenticateJWT(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        (req as any).user = decoded;
    } catch {
        // Ignore invalid tokens for optional auth — treat as public
    }
    return next();
}
