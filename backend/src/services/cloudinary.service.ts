import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { AppError } from '../middlewares/error.middleware';

cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
});

const formatCloudinaryError = (error: unknown): string => {
    if (!error || typeof error !== 'object') {
        return 'Cloudinary upload failed';
    }

    const err = error as {
        message?: string;
        http_code?: number;
        error?: { message?: string };
    };
    const detail = err.error?.message || err.message || 'Cloudinary upload failed';

    if (err.http_code === 403 || /missing permissions|forbidden/i.test(detail)) {
        return (
            'Cloudinary rejected the upload (missing "create" permission). ' +
            'Fix: Cloudinary Console → Settings → API Keys → use a key with upload/create access, ' +
            'OR create an unsigned Upload Preset and set CLOUDINARY_UPLOAD_PRESET in backend/.env.'
        );
    }

    return detail;
};

/** Unsigned upload via preset — does not need API key "create" permission. */
const uploadWithUnsignedPreset = async (
    fileBuffer: Buffer,
    folder = 'sallehub/halls'
): Promise<{ secure_url: string; url: string; public_id: string }> => {
    const form = new FormData();
    form.append('file', `data:image/jpeg;base64,${fileBuffer.toString('base64')}`);
    form.append('upload_preset', env.cloudinaryUploadPreset);
    form.append('folder', folder);

    const endpoint = `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`;
    const response = await fetch(endpoint, { method: 'POST', body: form });
    const data = (await response.json()) as {
        secure_url?: string;
        url?: string;
        public_id?: string;
        error?: { message?: string };
    };

    if (!response.ok || !data.secure_url) {
        throw new AppError(
            formatCloudinaryError({
                http_code: response.status,
                message: data.error?.message || `Cloudinary upload failed (${response.status})`,
                error: data.error,
            }),
            502
        );
    }

    return {
        secure_url: data.secure_url,
        url: data.url || data.secure_url,
        public_id: data.public_id || '',
    };
};

const uploadWithSignedApi = async (
    fileBuffer: Buffer,
    folder = 'sallehub/halls'
): Promise<{ secure_url: string; url: string; public_id: string }> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error || !result) {
                    reject(new AppError(formatCloudinaryError(error), 502));
                    return;
                }

                resolve({
                    secure_url: result.secure_url,
                    url: result.url,
                    public_id: result.public_id,
                });
            }
        );

        stream.end(fileBuffer);
    });
};

export const uploadHallImage = async (fileBuffer: Buffer, folder = 'sallehub/halls') => {
    if (!env.cloudinaryCloudName) {
        throw new AppError(
            'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME (and API credentials or CLOUDINARY_UPLOAD_PRESET).',
            503
        );
    }

    // Prefer unsigned preset when set — works even if API key lacks create permission.
    if (env.cloudinaryUploadPreset) {
        return uploadWithUnsignedPreset(fileBuffer, folder);
    }

    if (!env.useCloudinaryStorage) {
        throw new AppError(
            'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.',
            503
        );
    }

    return uploadWithSignedApi(fileBuffer, folder);
};

/** Extract full Cloudinary public_id including folder from a secure URL. */
export const extractCloudinaryPublicId = (imageUrl: string): string | null => {
    try {
        const withoutQuery = imageUrl.split('?')[0];
        const uploadMarker = '/upload/';
        const idx = withoutQuery.indexOf(uploadMarker);
        if (idx === -1) return null;

        let pathPart = withoutQuery.slice(idx + uploadMarker.length);
        const versionMatch = pathPart.match(/^v\d+\//);
        if (versionMatch) {
            pathPart = pathPart.slice(versionMatch[0].length);
        } else if (pathPart.includes('/') && !pathPart.startsWith('sallehub/')) {
            const firstSlash = pathPart.indexOf('/');
            const maybeTransforms = pathPart.slice(0, firstSlash);
            if (maybeTransforms.includes('_') || maybeTransforms.includes(',')) {
                pathPart = pathPart.slice(firstSlash + 1);
            }
        }

        return pathPart.replace(/\.[^/.]+$/, '') || null;
    } catch {
        return null;
    }
};

export const deleteHallImage = async (publicId: string) => {
    if (!env.useCloudinaryStorage) {
        return false;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
};
