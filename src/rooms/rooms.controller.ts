import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { RoomsService } from './rooms.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNewRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  async createRoom(
    @Body() dto: CreateNewRoomDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 15 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.roomsService.addNewRoom({
      roomType: dto.roomType,
      roomPrice: dto.roomPrice,
      photo: file
        ? { buffer: file.buffer, mimetype: file.mimetype }
        : undefined,
    });
  }

  @Get()
  async getAllRooms() {
    return this.roomsService.getAllRooms();
  }

  @Get(':id')
  async getRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.getRoomById(id);
  }

  @Get(':id/photo')
  async getPhotoByRoomId(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const room = await this.roomsService.getRoomById(id);
    if (!room?.photo) {
      throw new NotFoundException('Photo not found');
    }

    const photoPath = await this.roomsService.getPhotoPath(room.photo);
    res.sendFile(photoPath);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiBearerAuth('access-token')
  async deleteRoom(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.deleteRoom(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  async updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 15 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.roomsService.updateRoom(
      id,
      dto.roomType,
      dto.roomPrice,
      file ? { buffer: file.buffer, mimetype: file.mimetype } : undefined,
    );
  }
}
