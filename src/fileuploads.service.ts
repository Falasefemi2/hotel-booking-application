import { Injectable } from '@nestjs/common';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads', 'rooms');

  constructor() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveRoomPhoto(
    roomId: number,
    buffer: Buffer,
    mimetype: string,
  ): Promise<string> {
    const extension = mimetype.split('/')[1] || 'jpg';
    const filename = `room-${roomId}-${Date.now()}.${extension}`;
    const filepath = join(this.uploadDir, filename);

    await writeFile(filepath, buffer);
    return `/uploads/rooms/${filename}`;
  }

  async deleteRoomPhoto(photoUrl: string): Promise<void> {
    if (!photoUrl) return;

    const parts = photoUrl.split('/');
    const filename = parts.pop();
    if (!filename) return;

    const filepath = join(this.uploadDir, filename);

    try {
      await unlink(filepath);
    } catch (error) {
      console.warn(`Failed to delete photo: ${filepath}`);
    }
  }
}
