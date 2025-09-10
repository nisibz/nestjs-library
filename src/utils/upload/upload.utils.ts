import * as fs from 'fs';
import * as path from 'path';

export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName).toLowerCase();
  return `${timestamp}-${randomString}${ext}`;
}

export function ensureUploadDirectory(uploadPath: string): void {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
}

export function deleteFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

export function getUploadPath(...segments: string[]): string {
  return path.join(process.cwd(), 'uploads', ...segments);
}
