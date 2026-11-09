import path from 'path';
import fs from 'fs';

export interface StorageResult {
  url: string;
  driver: 'local' | 's3' | 'cloudinary';
  filename: string;
  size: number;
  mimeType: string;
}

export interface StorageProvider {
  uploadFile(file: Express.Multer.File, folder?: string): Promise<StorageResult>;
  deleteFile(fileUrl: string): Promise<boolean>;
}

class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<StorageResult> {
    return {
      url: `/uploads/${file.filename}`,
      driver: 'local',
      filename: file.filename,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

class S3StorageProvider implements StorageProvider {
  // S3 / Cloudflare R2 implementation placeholder
  async uploadFile(file: Express.Multer.File): Promise<StorageResult> {
    const s3Bucket = process.env.S3_BUCKET || 'jalsasalana-media';
    const s3Region = process.env.AWS_REGION || 'us-east-1';
    const url = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${file.filename}`;
    return {
      url,
      driver: 's3',
      filename: file.filename,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async deleteFile(): Promise<boolean> {
    return true;
  }
}

export function getStorageProvider(): StorageProvider {
  const driver = process.env.STORAGE_DRIVER || 'local';
  if (driver === 's3') {
    return new S3StorageProvider();
  }
  return new LocalStorageProvider();
}
