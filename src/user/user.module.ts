import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { BookTransactionModule } from '../book-transaction/book-transaction.module';

@Module({
  imports: [AuthModule, BookTransactionModule],
  controllers: [UserController],
})
export class UserModule {}
