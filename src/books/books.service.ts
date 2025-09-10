import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  BooksRepository,
  FindAllBooksQuery,
  PaginatedBooks,
} from './books.repository';

@Injectable()
export class BooksService {
  constructor(private booksRepository: BooksRepository) {}

  async create(createBookDto: CreateBookDto) {
    const existingBook = await this.booksRepository.findByIsbn(createBookDto.isbn);
    if (existingBook) {
      throw new ConflictException('A book with this ISBN already exists');
    }
    
    return this.booksRepository.create(createBookDto);
  }

  async findAll(query: FindAllBooksQuery = {}): Promise<PaginatedBooks> {
    return this.booksRepository.findAll(query);
  }

  async findOne(id: number) {
    const book = await this.booksRepository.findOne(id);

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    if (updateBookDto.isbn) {
      const existingBook = await this.booksRepository.findByIsbn(updateBookDto.isbn);
      if (existingBook && existingBook.id !== id) {
        throw new ConflictException('A book with this ISBN already exists');
      }
    }

    return this.booksRepository.update(id, updateBookDto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.booksRepository.remove(id);
  }
}
