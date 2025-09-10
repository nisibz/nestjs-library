import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  BooksRepository,
  FindAllBooksQuery,
  PaginatedBooks,
} from './books.repository';
import { FileService } from '../utils/upload/file.service';

@Injectable()
export class BooksService {
  constructor(
    private booksRepository: BooksRepository,
    private fileService: FileService,
  ) {}

  private transformBookResponse<T extends { coverImage?: string | null }>(
    book: T,
  ): T {
    if (book.coverImage) {
      book.coverImage = this.fileService.getFileUrl(book.coverImage);
    }
    return book;
  }

  async create(createBookDto: CreateBookDto, file?: Express.Multer.File) {
    const existingBook = await this.booksRepository.findByIsbn(
      createBookDto.isbn,
    );
    if (existingBook) {
      throw new ConflictException('A book with this ISBN already exists');
    }

    let coverImage: string | undefined;
    if (file) {
      coverImage = this.fileService.saveFile(file);
    }

    const book = await this.booksRepository.create({
      ...createBookDto,
      coverImage,
    });

    return this.transformBookResponse(book);
  }

  async findAll(query: FindAllBooksQuery = {}): Promise<PaginatedBooks> {
    const result = await this.booksRepository.findAll(query);
    result.data = result.data.map((book) => this.transformBookResponse(book));
    return result;
  }

  async findOne(id: number) {
    const book = await this.booksRepository.findOne(id);

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return this.transformBookResponse(book);
  }

  async update(
    id: number,
    updateBookDto: UpdateBookDto,
    file?: Express.Multer.File,
  ) {
    // Get the raw book without URL transformation for file operations
    const existingBook = await this.booksRepository.findOne(id);
    if (!existingBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (updateBookDto.isbn) {
      const bookWithSameIsbn = await this.booksRepository.findByIsbn(
        updateBookDto.isbn,
      );
      if (bookWithSameIsbn && bookWithSameIsbn.id !== id) {
        throw new ConflictException('A book with this ISBN already exists');
      }
    }

    let coverImage: string | undefined;
    if (file) {
      // Delete old cover image if it exists
      if (existingBook.coverImage) {
        this.fileService.deleteFile(existingBook.coverImage);
      }
      coverImage = this.fileService.saveFile(file);
    }

    const updatedBook = await this.booksRepository.update(id, {
      ...updateBookDto,
      ...(coverImage !== undefined && { coverImage }),
    });

    return this.transformBookResponse(updatedBook);
  }

  async remove(id: number) {
    // Get the raw book without URL transformation for file operations
    const book = await this.booksRepository.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Delete cover image if it exists
    if (book.coverImage) {
      this.fileService.deleteFile(book.coverImage);
    }

    return this.booksRepository.remove(id);
  }
}
