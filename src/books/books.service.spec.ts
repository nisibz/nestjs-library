import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksRepository } from './books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

const mockBooksRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByIsbn: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('BooksService', () => {
  let service: BooksService;

  const mockBook = {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
    publicationYear: 2023,
    coverImage: 'test-cover.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: BooksRepository,
          useValue: mockBooksRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);

    // Reset all mocks
    Object.values(mockBooksRepository).forEach((mock) => mock.mockReset());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        publicationYear: 2023,
        coverImage: 'test-cover.jpg',
      };

      mockBooksRepository.findByIsbn.mockResolvedValue(null);
      mockBooksRepository.create.mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);

      expect(mockBooksRepository.findByIsbn).toHaveBeenCalledWith('1234567890');
      expect(mockBooksRepository.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBook);
    });

    it('should throw ConflictException if ISBN already exists', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        publicationYear: 2023,
      };

      mockBooksRepository.findByIsbn.mockResolvedValue(mockBook);

      await expect(service.create(createBookDto)).rejects.toThrow(
        new ConflictException('A book with this ISBN already exists'),
      );

      expect(mockBooksRepository.findByIsbn).toHaveBeenCalledWith('1234567890');
      expect(mockBooksRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const mockPaginatedResponse = {
        data: [mockBook],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      };

      mockBooksRepository.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await service.findAll();

      expect(mockBooksRepository.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should return paginated books with query parameters', async () => {
      const query = { search: 'Test', page: 2, limit: 5 };
      const mockPaginatedResponse = {
        data: [mockBook],
        pagination: {
          page: 2,
          limit: 5,
          total: 1,
          pages: 1,
        },
      };

      mockBooksRepository.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await service.findAll(query);

      expect(mockBooksRepository.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockBooksRepository.findOne.mockResolvedValue(mockBook);

      const result = await service.findOne(1);

      expect(mockBooksRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException if book not found', async () => {
      mockBooksRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Book with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
      };
      const updatedBook = { ...mockBook, title: 'Updated Title' };

      mockBooksRepository.findOne.mockResolvedValue(mockBook);
      mockBooksRepository.update.mockResolvedValue(updatedBook);

      const result = await service.update(1, updateBookDto);

      expect(mockBooksRepository.findOne).toHaveBeenCalledWith(1);
      expect(mockBooksRepository.update).toHaveBeenCalledWith(1, updateBookDto);
      expect(result).toEqual(updatedBook);
    });

    it('should update a book with new ISBN', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
        isbn: '9999999999',
      };
      const updatedBook = { ...mockBook, title: 'Updated Title', isbn: '9999999999' };

      mockBooksRepository.findOne.mockResolvedValue(mockBook);
      mockBooksRepository.findByIsbn.mockResolvedValue(null);
      mockBooksRepository.update.mockResolvedValue(updatedBook);

      const result = await service.update(1, updateBookDto);

      expect(mockBooksRepository.findOne).toHaveBeenCalledWith(1);
      expect(mockBooksRepository.findByIsbn).toHaveBeenCalledWith('9999999999');
      expect(mockBooksRepository.update).toHaveBeenCalledWith(1, updateBookDto);
      expect(result).toEqual(updatedBook);
    });

    it('should throw ConflictException if ISBN already exists during update', async () => {
      const updateBookDto: UpdateBookDto = {
        isbn: '9999999999',
      };
      const existingBookWithIsbn = { ...mockBook, id: 2, isbn: '9999999999' };

      mockBooksRepository.findOne.mockResolvedValue(mockBook);
      mockBooksRepository.findByIsbn.mockResolvedValue(existingBookWithIsbn);

      await expect(service.update(1, updateBookDto)).rejects.toThrow(
        new ConflictException('A book with this ISBN already exists'),
      );

      expect(mockBooksRepository.findOne).toHaveBeenCalledWith(1);
      expect(mockBooksRepository.findByIsbn).toHaveBeenCalledWith('9999999999');
      expect(mockBooksRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if book not found during update', async () => {
      mockBooksRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { title: 'Updated' })).rejects.toThrow(
        new NotFoundException('Book with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      mockBooksRepository.findOne.mockResolvedValue(mockBook);
      mockBooksRepository.remove.mockResolvedValue(mockBook);

      const result = await service.remove(1);

      expect(mockBooksRepository.findOne).toHaveBeenCalledWith(1);
      expect(mockBooksRepository.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException if book not found during delete', async () => {
      mockBooksRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Book with ID 999 not found'),
      );
    });
  });
});
