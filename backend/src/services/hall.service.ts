import { Hall } from '../models';
import { uploadHallImage, deleteHallImage, extractCloudinaryPublicId } from './cloudinary.service';
import { AppError } from '../middlewares/error.middleware';
import { slugify } from '../utils/id.utils';

const REQUIRED_HALL_FIELDS = [
  'name',
  'location',
  'capacity',
  'price',
  'description',
  'workingHours',
  'size',
] as const;

const parseFacilities = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const parseImages = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return [value];
    }
  }
  return [];
};

const generateHallId = async (name: string) => {
  const base = slugify(name);
  let candidate = base;
  let attempt = 1;

  while (await Hall.exists({ id: candidate })) {
    attempt += 1;
    candidate = `${base}-${attempt}`;
  }

  return candidate;
};

export const listHalls = async () => {
  return Hall.find({}).sort({ createdAt: -1 });
};

export const getHallById = async (hallId: string) => {
  return Hall.findOne({ id: hallId });
};

export const createHall = async (hallData: Record<string, unknown>, images?: Express.Multer.File[]) => {
  for (const field of REQUIRED_HALL_FIELDS) {
    if (hallData[field] === undefined || hallData[field] === null || hallData[field] === '') {
      throw new AppError(`${field} is required`, 400);
    }
  }

  const capacity = Number(hallData.capacity);
  const price = Number(hallData.price);
  if (!Number.isFinite(capacity) || capacity < 1) {
    throw new AppError('capacity must be a positive number', 400);
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new AppError('price must be a non-negative number', 400);
  }

  const existingUrls = [
    ...parseImages(hallData.images),
    ...parseImages(hallData.existingImages),
  ].filter((url) => url && !url.startsWith('blob:') && !url.startsWith('data:'));

  let uploadedImages = [...existingUrls];

  if (images && images.length > 0) {
    const failures: string[] = [];
    for (const image of images) {
      try {
        const result = await uploadHallImage(image.buffer);
        uploadedImages.push(result.secure_url);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Cloudinary upload failed';
        console.error('Failed to upload image to Cloudinary:', message);
        failures.push(message);
      }
    }

    // If every file upload failed, do not create a hall without the intended images.
    if (failures.length === images.length) {
      throw new AppError(failures[0] || 'Failed to upload images to Cloudinary', 502);
    }
  }

  if (uploadedImages.length === 0) {
    throw new AppError('At least one hall image is required (upload a file or provide an image URL)', 400);
  }

  const id =
    typeof hallData.id === 'string' && hallData.id.trim()
      ? hallData.id.trim()
      : await generateHallId(String(hallData.name));

  const existing = await Hall.findOne({ id });
  if (existing) {
    throw new AppError('A hall with this id already exists', 409);
  }

  return Hall.create({
    id,
    name: String(hallData.name).trim(),
    location: String(hallData.location).trim(),
    capacity,
    price,
    status: hallData.status === 'Inactive' ? 'Inactive' : 'Active',
    images: uploadedImages,
    description: String(hallData.description).trim(),
    facilities: parseFacilities(hallData.facilities),
    workingHours: String(hallData.workingHours).trim(),
    size: String(hallData.size).trim(),
    securityDeposit:
      hallData.securityDeposit !== undefined && hallData.securityDeposit !== ''
        ? Number(hallData.securityDeposit)
        : undefined,
  });
};

export const updateHall = async (
  hallId: string,
  updateData: Record<string, unknown>,
  newImages?: Express.Multer.File[]
) => {
  const currentHall = await Hall.findOne({ id: hallId });
  if (!currentHall) return null;

  let updatedImages = [...currentHall.images];

  if (newImages && newImages.length > 0) {
    const failures: string[] = [];
    for (const image of newImages) {
      try {
        const result = await uploadHallImage(image.buffer);
        updatedImages.push(result.secure_url);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Cloudinary upload failed';
        console.error('Failed to upload image to Cloudinary:', message);
        failures.push(message);
      }
    }
    if (failures.length === newImages.length) {
      throw new AppError(failures[0] || 'Failed to upload images to Cloudinary', 502);
    }
  }

  if (updateData.images !== undefined) {
    updatedImages = parseImages(updateData.images);
  }

  const patch: Record<string, unknown> = {
    updatedAt: new Date(),
    images: updatedImages,
  };

  if (updateData.name !== undefined) patch.name = String(updateData.name).trim();
  if (updateData.location !== undefined) patch.location = String(updateData.location).trim();
  if (updateData.description !== undefined) patch.description = String(updateData.description).trim();
  if (updateData.workingHours !== undefined) patch.workingHours = String(updateData.workingHours).trim();
  if (updateData.size !== undefined) patch.size = String(updateData.size).trim();
  if (updateData.status !== undefined) {
    patch.status = updateData.status === 'Inactive' ? 'Inactive' : 'Active';
  }
  if (updateData.facilities !== undefined) {
    patch.facilities = parseFacilities(updateData.facilities);
  }
  if (updateData.capacity !== undefined) {
    const capacity = Number(updateData.capacity);
    if (!Number.isFinite(capacity) || capacity < 1) {
      throw new AppError('capacity must be a positive number', 400);
    }
    patch.capacity = capacity;
  }
  if (updateData.price !== undefined) {
    const price = Number(updateData.price);
    if (!Number.isFinite(price) || price < 0) {
      throw new AppError('price must be a non-negative number', 400);
    }
    patch.price = price;
  }
  if (updateData.securityDeposit !== undefined) {
    patch.securityDeposit =
      updateData.securityDeposit === '' || updateData.securityDeposit === null
        ? undefined
        : Number(updateData.securityDeposit);
  }

  return Hall.findOneAndUpdate({ id: hallId }, patch, { new: true, runValidators: true });
};

export const deleteHall = async (hallId: string) => {
  const hall = await Hall.findOne({ id: hallId });
  if (!hall) return false;

  for (const imageUrl of hall.images) {
    try {
      const publicId = extractCloudinaryPublicId(imageUrl);
      if (publicId) {
        await deleteHallImage(publicId);
      }
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }
  }

  const result = await Hall.deleteOne({ id: hallId });
  return result.deletedCount > 0;
};
