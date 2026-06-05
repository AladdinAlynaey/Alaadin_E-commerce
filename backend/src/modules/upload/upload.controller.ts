import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':directory')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('directory') directory: string) {
    const path = await this.uploadService.save(file, directory);
    return { path, url: this.uploadService.getUrl(path) };
  }

  @Post(':directory/multiple')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Param('directory') directory: string) {
    const paths = await this.uploadService.saveMultiple(files, directory);
    return paths.map(p => ({ path: p, url: this.uploadService.getUrl(p) }));
  }
}
