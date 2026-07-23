/** Normalize booking/payment IDs so `#BK-1020` and `BK-1020` match the same record. */
export const normalizeId = (value: string) =>
  String(value || '')
    .replace(/^#/, '')
    .trim();

/** Prefer stored form with `#` prefix when querying either shape. */
export const bookingIdVariants = (value: string) => {
  const bare = normalizeId(value);
  if (!bare) return [];
  return bare.startsWith('BK-') || bare.startsWith('PY-')
    ? [`#${bare}`, bare]
    : [bare, `#${bare}`];
};

export const toNullableString = (value?: string | null) => value?.trim() || '';

export const isTruthy = (value: unknown) => Boolean(value);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'hall';
