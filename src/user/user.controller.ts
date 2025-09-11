import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { BookTransactionService } from '../book-transaction/book-transaction.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '../types/user.interface';
import type { RequestWithUser } from '../types/request.interface';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly bookTransactionService: BookTransactionService,
  ) {}

  @Get('borrowed-books')
  getBorrowedBooks(
    @CurrentUser() user: User,
    @Req() request?: RequestWithUser,
  ) {
    return this.bookTransactionService.getUserBorrowedBooks(user.id, request);
  }
}
