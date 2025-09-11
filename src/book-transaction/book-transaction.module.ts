import { Module } from '@nestjs/common';
import { BookTransactionService } from './book-transaction.service';
import { BookTransactionRepository } from './book-transaction.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { BooksRepository } from '../books/books.repository';
import { FileService } from '../utils/upload/file.service';

@Module({
  imports: [PrismaModule],
  providers: [
    BookTransactionService,
    BookTransactionRepository,
    BooksRepository,
    FileService,
  ],
  exports: [BookTransactionService],
})
export class BookTransactionModule {}
