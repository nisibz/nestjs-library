export interface UploadedFileInfo {
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface FileValidationOptions {
  allowedMimeTypes: string[];
  maxSize: number;
}

export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
