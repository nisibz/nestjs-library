import * as bcrypt from 'bcryptjs';

export class BcryptUtil {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
