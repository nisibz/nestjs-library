import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BooksRepository } from './books.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { FileService } from '../utils/upload/file.service';
import { AuthModule } from '../auth/auth.module';
import { BookTransactionModule } from '../book-transaction/book-transaction.module';

@Module({
  imports: [PrismaModule, AuthModule, BookTransactionModule],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository, FileService],
})
export class BooksModule {}
