import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookedroomModule } from './bookedroom/bookedroom.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    RoomsModule,
    BookedroomModule,
  ],
  controllers: [],
  providers: [],
  // providers: [],
  // exports: [],
})
export class AppModule {}
