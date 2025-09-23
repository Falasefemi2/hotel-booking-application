import { Injectable } from '@nestjs/common';
import { BookedRoom, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { randomBytes } from 'crypto';

@Injectable()
export class BookedroomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomService: RoomsService,
  ) {}

  private generateBookingCode(length = 10): string {
    return randomBytes(length)
      .toString('base64')
      .replace(/[^A-Z0-9]/gi, '')
      .substring(0, length)
      .toUpperCase();
  }

  async findBookingByRoomId(roomId: number): Promise<BookedRoom[]> {
    return this.prisma.bookedRoom.findMany({
      where: { roomId },
    });
  }

  async cancelBooking(roomId: number): Promise<number> {
    const result = await this.prisma.bookedRoom.deleteMany({
      where: { roomId },
    });

    if (result.count > 0) {
      await this.prisma.room.update({
        where: { id: roomId },
        data: { isBooked: false },
      });
    }

    return result.count;
  }

  async saveBooking(
    roomId: number,
    bookingRequest: Omit<
      Prisma.BookedRoomCreateInput,
      'room' | 'bookingConfirmationCode'
    >,
  ): Promise<{ message: string; bookingCode: string }> {
    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.isBooked) {
      throw new Error('Room is already booked');
    }
    let bookingCode = this.generateBookingCode();
    let exists = await this.prisma.bookedRoom.findUnique({
      where: { bookingConfirmationCode: bookingCode },
    });

    while (exists) {
      bookingCode = this.generateBookingCode();
      exists = await this.prisma.bookedRoom.findUnique({
        where: { bookingConfirmationCode: bookingCode },
      });
    }

    await this.prisma.bookedRoom.create({
      data: {
        ...bookingRequest,
        bookingConfirmationCode: bookingCode,
        room: { connect: { id: roomId } },
      },
    });
    await this.prisma.room.update({
      where: { id: roomId },
      data: { isBooked: true },
    });

    return {
      message: 'Booking saved successfully',
      bookingCode,
    };
  }

  async findByBookingConfirmationCode(
    bookingConfirmationCode: string,
  ): Promise<BookedRoom | null> {
    return this.prisma.bookedRoom.findUnique({
      where: { bookingConfirmationCode },
    });
  }

  async findAllBookings(): Promise<BookedRoom[]> {
    return this.prisma.bookedRoom.findMany();
  }

  async findBookingByUserEmail(email: string): Promise<BookedRoom[]> {
    return this.prisma.bookedRoom.findMany({
      where: { guestEmail: email },
    });
  }
}
