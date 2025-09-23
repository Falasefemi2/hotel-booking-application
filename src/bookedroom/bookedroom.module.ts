import { Module } from '@nestjs/common';
import { BookedroomController } from './bookedroom.controller';
import { BookedroomService } from './bookedroom.service';
import { PrismaService } from 'src/prisma.service';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  controllers: [BookedroomController],
  providers: [BookedroomService, PrismaService, RoomsService],
})
export class BookedroomModule {}
