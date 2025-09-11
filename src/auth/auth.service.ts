import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BcryptUtil } from '../utils/bcrypt.util';
import { JwtService } from '../utils/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  private createTokenResponse(user: { id: number; username: string }) {
    const payload = { username: user.username, sub: user.id };
    try {
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          username: user.username,
        },
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Failed to generate token');
    }
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.authRepository.findByUsername(
      registerDto.username,
    );
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await BcryptUtil.hash(registerDto.password);
    const user = await this.authRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.createTokenResponse(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.authRepository.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await BcryptUtil.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createTokenResponse(user);
  }

  async validateUser(userId: number) {
    return this.authRepository.findById(userId);
  }
}
