import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from '@prisma/client';

export interface FindAllBooksQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedBooks {
  data: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable()
export class BooksRepository {
  constructor(private prisma: PrismaService) {}

  async findByIsbn(isbn: string): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { isbn },
    });
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    return this.prisma.book.create({
      data: createBookDto,
    });
  }

  async findAll(query: FindAllBooksQuery = {}): Promise<PaginatedBooks> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { author: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async remove(id: number): Promise<Book> {
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
