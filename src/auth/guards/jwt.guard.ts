import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../../utils/jwt.service';
import { AuthService } from '../auth.service';
import { RequestWithOptionalUser } from '../../types/request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = this.jwtService.verify(token) as { sub?: number };

      if (!payload.sub || typeof payload.sub !== 'number') {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.authService.validateUser(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(
    request: RequestWithOptionalUser,
  ): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
