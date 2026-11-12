export const MAX_GUIDE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_GUIDE_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
] as const;

export type AllowedGuideImageMimeType = (typeof ALLOWED_GUIDE_IMAGE_MIME_TYPES)[number];
