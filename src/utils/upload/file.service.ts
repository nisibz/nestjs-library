import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { deleteFile, getUploadPath } from './upload.utils';

@Injectable()
export class FileService {
  saveFile(file: Express.Multer.File): string {
    // File is already saved by multer, just return the relative path
    // The file.path contains the full path, we need just the relative part from uploads/
    const relativePath = path.relative(getUploadPath(), file.path);
    return relativePath.replace(/\\/g, '/'); // Normalize path separators for URLs
  }

  deleteFile(relativePath: string): void {
    if (!relativePath) return;

    const fullPath = getUploadPath(relativePath);
    deleteFile(fullPath);
  }

  getFileUrl(relativePath: string, request?: any): string | null {
    if (!relativePath) return null;

    // If request is provided, build full URL with hostname
    if (request) {
      const protocol = request.secure ? 'https' : 'http';
      const host = request.get('host');
      return `${protocol}://${host}/uploads/${relativePath}`;
    }

    // Return a URL path that can be served by the application
    return `/uploads/${relativePath}`;
  }
}
