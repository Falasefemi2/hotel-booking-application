import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BookedroomService } from './bookedroom.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookedroomController {
  constructor(private readonly bookedroomService: BookedroomService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  @ApiBearerAuth('access-token')
  async getAllBookings() {
    return this.bookedroomService.findAllBookings();
  }

  @Get('/confirmation/:confirmationCode')
  async getBookingByConfirmationCode(@Param('confirmationCode') code: string) {
    return this.bookedroomService.findByBookingConfirmationCode(code);
  }

  @Get('/user/:email/bookings')
  async getBookingsByEmail(@Param('email') email: string) {
    return this.bookedroomService.findBookingByUserEmail(email);
  }

  @Post('/room/:roomId/booking')
  async saveBooking(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() bookingDto: CreateBookingDto,
  ) {
    return this.bookedroomService.saveBooking(roomId, bookingDto);
  }

  @Delete('/booking/:bookingId/delete')
  async cancelBooking(@Param('bookingId', ParseIntPipe) bookingId: number) {
    return this.bookedroomService.cancelBooking(bookingId);
  }
}
