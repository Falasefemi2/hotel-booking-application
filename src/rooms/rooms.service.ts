import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { FileUploadService } from 'src/fileuploads.service';
import { PrismaService } from 'src/prisma.service';

type RoomWithoutPhoto = Omit<Room, 'photo'>;

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async addNewRoom(data: {
    roomType: string;
    roomPrice: number;
    photo?: Buffer;
  }): Promise<Room> {
    return this.prisma.room.create({
      data: {
        roomType: data.roomType,
        roomPrice: data.roomPrice,
        photo: data.photo?.toString('base64'),
      },
    });
  }

  async getAllRooms(): Promise<RoomWithoutPhoto[]> {
    return this.prisma.room.findMany({
      select: {
        id: true,
        roomType: true,
        roomPrice: true,
        isBooked: true,
        createdAt: true,
        updatedAt: true,
      },
    });
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
      await this.fileUploadService.deleteRoomPhoto(room?.photo);
    }

    return this.prisma.room.delete({ where: { id: roomId } });
  }

  async updateRoom(
    roomId: number,
    roomType?: string,
    roomPrice?: number,
    photoBytes?: Buffer,
  ): Promise<Room> {
    return this.prisma.room.update({
      where: { id: roomId },
      data: {
        ...(roomType && { roomType }),
        ...(roomPrice && { roomPrice }),
        ...(photoBytes && { photo: photoBytes.toString('base64') }),
      },
    });
  }

  async getRoomById(roomId: number): Promise<RoomWithoutPhoto | null> {
    return this.prisma.room.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        roomType: true,
        roomPrice: true,
        isBooked: true,
        createdAt: true,
        updatedAt: true,
        photo: true,
      },
    });
  }

  async getAvailableRooms(): Promise<RoomWithoutPhoto[]> {
    return this.prisma.room.findMany({
      where: { isBooked: false },
      select: {
        id: true,
        roomType: true,
        roomPrice: true,
        isBooked: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getRoomWithPhoto(roomId: number): Promise<Room | null> {
    return this.prisma.room.findUnique({
      where: { id: roomId },
    });
  }
}
