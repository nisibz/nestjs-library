import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { BookTransactionService } from '../book-transaction/book-transaction.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { multerConfig } from '../utils/upload/multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '../types/user.interface';
import type { RequestWithUser } from '../types/request.interface';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly bookTransactionService: BookTransactionService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('coverImage', multerConfig))
  create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() request?: RequestWithUser,
  ) {
    return this.booksService.create(createBookDto, file, request);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Req() request?: RequestWithUser,
  ) {
    return this.booksService.findAll(
      {
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        search,
      },
      request,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request?: RequestWithUser) {
    return this.booksService.findOne(+id, request);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverImage', multerConfig))
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() request?: RequestWithUser,
  ) {
    return this.booksService.update(+id, updateBookDto, file, request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @Post(':id/borrow')
  borrowBook(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookTransactionService.borrowBook(+id, user.id);
  }

  @Post(':id/return')
  returnBook(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookTransactionService.returnBook(+id, user.id);
  }

  @Get(':id/transactions')
  getBookTransactions(@Param('id') id: string) {
    return this.bookTransactionService.getBookTransactions(+id);
  }
}
