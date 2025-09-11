import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookTransactionRepository {
  constructor(private prisma: PrismaService) {}

  async create(bookId: number, userId: number) {
    return this.prisma.bookTransaction.create({
      data: {
        bookId,
        userId,
      },
      include: {
        book: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async findActiveByBookAndUser(bookId: number, userId: number) {
    return this.prisma.bookTransaction.findFirst({
      where: {
        bookId,
        userId,
        returnDate: null,
      },
      include: {
        book: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async returnBook(id: number) {
    return this.prisma.bookTransaction.update({
      where: { id },
      data: {
        returnDate: new Date(),
      },
      include: {
        book: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async findBorrowedBooksByUser(userId: number) {
    return this.prisma.bookTransaction.findMany({
      where: {
        userId,
        returnDate: null,
      },
      include: {
        book: true,
      },
    });
  }

  async findBookTransactions(bookId: number) {
    return this.prisma.bookTransaction.findMany({
      where: {
        bookId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        borrowDate: 'desc',
      },
    });
  }

  async countActiveBorrowedBooks(bookId: number) {
    return this.prisma.bookTransaction.count({
      where: {
        bookId,
        returnDate: null,
      },
    });
  }
}
