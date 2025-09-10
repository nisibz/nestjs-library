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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { multerConfig } from '../utils/upload/multer.config';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseInterceptors(FileInterceptor('coverImage', multerConfig))
  create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() request?: any,
  ) {
    return this.booksService.create(createBookDto, file, request);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Req() request?: any,
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
  findOne(@Param('id') id: string, @Req() request?: any) {
    return this.booksService.findOne(+id, request);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverImage', multerConfig))
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() request?: any,
  ) {
    return this.booksService.update(+id, updateBookDto, file, request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
