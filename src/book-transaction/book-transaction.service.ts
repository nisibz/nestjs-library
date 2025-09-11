import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BookTransactionRepository } from './book-transaction.repository';
import { BooksRepository } from '../books/books.repository';
import { FileService } from '../utils/upload/file.service';
import { RequestWithUser } from '../types/request.interface';

@Injectable()
export class BookTransactionService {
  constructor(
    private bookTransactionRepository: BookTransactionRepository,
    private booksRepository: BooksRepository,
    private fileService: FileService,
  ) {}

  async borrowBook(bookId: number, userId: number) {
    const book = await this.booksRepository.findOne(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.quantity <= 0) {
      throw new BadRequestException('Book is not available for borrowing');
    }

    const existingTransaction =
      await this.bookTransactionRepository.findActiveByBookAndUser(
        bookId,
        userId,
      );
    if (existingTransaction) {
      throw new BadRequestException('You have already borrowed this book');
    }

    // Decrease book quantity and create transaction
    await this.booksRepository.decreaseQuantity(bookId);
    return this.bookTransactionRepository.create(bookId, userId);
  }

  async returnBook(bookId: number, userId: number) {
    const activeTransaction =
      await this.bookTransactionRepository.findActiveByBookAndUser(
        bookId,
        userId,
      );
    if (!activeTransaction) {
      throw new NotFoundException(
        'No active borrowing record found for this book',
      );
    }

    // Increase book quantity and update transaction
    await this.booksRepository.increaseQuantity(bookId);
    return this.bookTransactionRepository.returnBook(activeTransaction.id);
  }

  async getUserBorrowedBooks(userId: number, request?: RequestWithUser) {
    const transactions =
      await this.bookTransactionRepository.findBorrowedBooksByUser(userId);

    return transactions.map((transaction) => ({
      ...transaction,
      book: {
        ...transaction.book,
        coverImage: transaction.book.coverImage
          ? this.fileService.getFileUrl(transaction.book.coverImage, request)
          : transaction.book.coverImage,
      },
    }));
  }

  async getBookTransactions(bookId: number) {
    const book = await this.booksRepository.findOne(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.bookTransactionRepository.findBookTransactions(bookId);
  }
}
