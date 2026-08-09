import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token.' });
    }

    const token = authHeader.slice(7).trim();
    if (!token || token.length > 4096) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret) as {
            id?: string;
            email?: string;
            name?: string;
            role?: string;
        };
        if (typeof decoded !== 'object' || decoded === null || !['admin', 'superadmin'].includes((decoded as { role?: string }).role || '')) {
            return res.status(403).json({ error: 'Forbidden: Administrator access required.' });
        }
        (req as any).user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
    }
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
    if ((req as any).user?.role !== 'superadmin') {
        return res.status(403).json({ error: 'Forbidden: Super administrator access required.' });
    }
    return next();
}

/** Attach user when a valid Bearer token is present; otherwise continue as public. */
export function optionalAuthenticateJWT(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.slice(7).trim();
    if (!token || token.length > 4096) return next();
    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        (req as any).user = decoded;
    } catch {
        // Ignore invalid tokens for optional auth — treat as public
    }
    return next();
}
