import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DEFAULT_JWT_SECRET = 'sallehub-super-secure-jwt-secret-key-2026';
const jwtSecret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || jwtSecret === DEFAULT_JWT_SECRET)) {
    throw new Error('JWT_SECRET must be set to a strong unique value in production');
}

if (!process.env.JWT_SECRET) {
    console.warn('[env] JWT_SECRET is not set — using insecure development default');
}

export const env = {
    port: Number(process.env.PORT || 3000),
    jwtSecret,
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    mongoUri: process.env.MONGO_URI || '',
    mongoDbName: process.env.MONGO_DB_NAME || 'sallehub',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
    cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || '',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    useCloudinaryStorage: Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET
    ),
};
