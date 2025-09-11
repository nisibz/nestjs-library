import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  private get secret(): string {
    return this.configService.get<string>('JWT_SECRET') ?? 'your-secret-key';
  }

  private get expiresIn(): string {
    const value = this.configService.get<string>('JWT_EXPIRES_IN') ?? '1d';
    return value;
  }

  sign(payload: object): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    } as jwt.SignOptions);
  }

  verify(token: string): jwt.JwtPayload {
    return jwt.verify(token, this.secret) as jwt.JwtPayload;
  }

  decode(token: string): jwt.JwtPayload | null {
    const decoded = jwt.decode(token);
    return decoded as jwt.JwtPayload | null;
  }
}
