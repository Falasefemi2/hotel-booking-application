import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaService } from 'src/prisma.service';
import { FileUploadService } from 'src/fileuploads.service';

@Module({
  providers: [RoomsService, PrismaService, FileUploadService],
  controllers: [RoomsController],
  exports: [RoomsService],
})
export class RoomsModule {}
