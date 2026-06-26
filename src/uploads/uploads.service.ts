import { Injectable, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as multer from 'multer';

@Injectable()
export class UploadsService {
    private readonly uploadDir = join(process.cwd(), 'public', 'uploads');

    constructor() {
        if (!existsSync(this.uploadDir)) {
            mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    getMulterStorage(subfolder: string) {
        const dest = join(this.uploadDir, subfolder);
        if (!existsSync(dest)) mkdirSync(dest, { recursive: true });

        return multer.diskStorage({
            destination: (_req, _file, cb) => cb(null, dest),
            filename: (_req, file, cb) => {
                const ext = file.originalname.split('.').pop();
                const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
                cb(null, name);
            },
        });
    }

    validateImageFile(file: Express.Multer.File) {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
            throw new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new BadRequestException('La imagen no puede superar los 5MB');
        }
    }

    buildPublicUrl(subfolder: string, filename: string): string {
        return `/uploads/${subfolder}/${filename}`;
    }
}
