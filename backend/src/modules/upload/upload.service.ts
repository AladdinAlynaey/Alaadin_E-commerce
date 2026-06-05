import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

export interface StorageProvider {
  save(file: Express.Multer.File, directory: string): Promise<string>;
  delete(filePath: string): Promise<void>;
  getUrl(filePath: string): string;
}

@Injectable()
export class UploadService implements StorageProvider {
  private readonly uploadDir: string;
  private readonly logger = new Logger(UploadService.name);

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('upload.dir', './uploads');
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = ['products', 'categories', 'payments', 'avatars'];
    for (const dir of dirs) {
      const fullPath = path.join(this.uploadDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  }

  async save(file: Express.Multer.File, directory: string = 'products'): Promise<string> {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
    const dirPath = path.join(this.uploadDir, directory);
    const filePath = path.join(dirPath, fileName);

    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    try {
      await sharp(file.buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(filePath);
    } catch {
      fs.writeFileSync(filePath, file.buffer);
    }

    return `/${directory}/${fileName}`;
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }

  getUrl(filePath: string): string {
    const baseUrl = this.configService.get('API_BASE_URL', 'http://localhost:3001');
    return `${baseUrl}/uploads${filePath}`;
  }

  async saveMultiple(files: Express.Multer.File[], directory: string): Promise<string[]> {
    return Promise.all(files.map(f => this.save(f, directory)));
  }
}
