import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtService } from '../utils/jwt.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtService],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
