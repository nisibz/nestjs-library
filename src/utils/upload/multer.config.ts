import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import {
  generateFileName,
  ensureUploadDirectory,
  getUploadPath,
} from './upload.utils';

export const multerConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const uploadPath = getUploadPath('books', 'covers');
      ensureUploadDirectory(uploadPath);
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const filename = generateFileName(file.originalname);
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(
        new BadRequestException(
          'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
        ),
        false,
      );
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
};
