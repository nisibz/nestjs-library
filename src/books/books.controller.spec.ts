import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

const mockBooksService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('BooksController', () => {
  let controller: BooksController;

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

  const mockPaginatedResponse = {
    data: [mockBook],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      pages: 1,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);

    // Reset all mocks
    Object.values(mockBooksService).forEach((mock) => mock.mockReset());
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        publicationYear: 2023,
      };

      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);

      expect(mockBooksService.create).toHaveBeenCalledWith(
        createBookDto,
        undefined,
      );
      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return paginated books without query parameters', async () => {
      mockBooksService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll();

      expect(mockBooksService.findAll).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
        search: undefined,
      });
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should return paginated books with query parameters', async () => {
      mockBooksService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll('2', '5', 'test search');

      expect(mockBooksService.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        search: 'test search',
      });
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should handle invalid page and limit parameters', async () => {
      mockBooksService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll('invalid', 'invalid', 'search');

      expect(mockBooksService.findAll).toHaveBeenCalledWith({
        page: NaN,
        limit: NaN,
        search: 'search',
      });
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne('1');

      expect(mockBooksService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
      };
      const updatedBook = { ...mockBook, title: 'Updated Title' };

      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await controller.update('1', updateBookDto);

      expect(mockBooksService.update).toHaveBeenCalledWith(
        1,
        updateBookDto,
        undefined,
      );
      expect(result).toEqual(updatedBook);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      mockBooksService.remove.mockResolvedValue(mockBook);

      const result = await controller.remove('1');

      expect(mockBooksService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBook);
    });
  });
});
