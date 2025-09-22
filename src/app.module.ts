import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [AuthModule, UsersModule, RolesModule, RoomsModule],
  controllers: [],
  // providers: [FileuploadsService],
  // exports: [FileuploadsService],
})
export class AppModule {}
