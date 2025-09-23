import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { RoomsModule } from './rooms/rooms.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, UsersModule, RolesModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService],
  // providers: [],
  // exports: [],
})
export class AppModule {}
