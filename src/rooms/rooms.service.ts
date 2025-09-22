import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

type RoomWithoutPhoto = Omit<Room, 'photo'>;

@Injectable()
export class RoomsService {
  private readonly uploadDir = join(process.cwd(), 'uploads', 'rooms');

  constructor(private readonly prisma: PrismaService) {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async addNewRoom(data: {
    roomType: string;
    roomPrice: number;
    photo?: { buffer: Buffer; mimetype: string };
  }): Promise<Room> {
    const room = await this.prisma.room.create({
      data: {
        roomType: data.roomType,
        roomPrice: data.roomPrice,
      },
    });

    if (data.photo) {
      const photoUrl = await this.saveRoomPhoto(
        room.id,
        data.photo.buffer,
        data.photo.mimetype,
      );
      return this.prisma.room.update({
        where: { id: room.id },
        data: { photo: photoUrl },
      });
    }

    return room;
  }

  private async saveRoomPhoto(
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
  async getAllRooms(): Promise<Room[]> {
    return this.prisma.room.findMany();
  }
  async getPhotoByRoomId(roomId: number): Promise<Buffer | null> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { photo: true },
    });

    if (!room?.photo) {
      return null;
    }

    return Buffer.from(room.photo, 'base64');
  }

  async deleteRoom(roomId: number): Promise<Room> {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });

    if (room?.photo) {
      await this.deleteRoomPhoto(room?.photo);
    }

    return this.prisma.room.delete({ where: { id: roomId } });
  }

  private async deleteRoomPhoto(photoUrl: string): Promise<void> {
    const filename = photoUrl.split('/').pop();
    const filepath = join(this.uploadDir, filename!);

    try {
      await unlink(filepath);
    } catch (error) {
      console.warn(`Failed to delete photo: ${filepath}`);
    }
  }

  async updateRoom(
    roomId: number,
    roomType?: string,
    roomPrice?: number,
    photo?: { buffer: Buffer; mimetype: string },
  ): Promise<Room> {
    const updateData: any = {
      ...(roomType && { roomType }),
      ...(roomPrice && { roomPrice }),
    };

    if (photo) {
      const existingRoom = await this.prisma.room.findUnique({
        where: { id: roomId },
      });
      if (existingRoom?.photo) {
        await this.deleteRoomPhoto(existingRoom.photo);
      }
      const photoUrl = await this.saveRoomPhoto(
        roomId,
        photo.buffer,
        photo.mimetype,
      );
      updateData.photoUrl = photoUrl;
    }

    return this.prisma.room.update({
      where: { id: roomId },
      data: updateData,
    });
  }

  async getRoomById(roomId: number): Promise<Room | null> {
    return this.prisma.room.findUnique({ where: { id: roomId } });
  }

  async getAvailableRooms(): Promise<Room[]> {
    return this.prisma.room.findMany({ where: { isBooked: false } });
  }

  async getRoomWithPhoto(roomId: number): Promise<Room | null> {
    return this.prisma.room.findUnique({
      where: { id: roomId },
    });
  }

  async getPhotoPath(photoUrl: string): Promise<string> {
    const filename = photoUrl.split('/').pop();
    return join(this.uploadDir, filename!);
  }
}
