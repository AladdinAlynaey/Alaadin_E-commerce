import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxSize: number;
  private readonly allowedTypes: string[];

  constructor(maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) {
    this.maxSize = maxSize;
    this.allowedTypes = allowedTypes;
  }

  transform(value: Express.Multer.File) {
    if (!value) throw new BadRequestException('File is required');
    if (value.size > this.maxSize) throw new BadRequestException(`File too large. Max: ${this.maxSize / 1024 / 1024}MB`);
    if (!this.allowedTypes.includes(value.mimetype)) throw new BadRequestException(`Invalid file type. Allowed: ${this.allowedTypes.join(', ')}`);
    return value;
  }
}
