import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async create(userData: RegisterDto & { password: string }) {
    return this.prisma.user.create({
      data: userData,
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
