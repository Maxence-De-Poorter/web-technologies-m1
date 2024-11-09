import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.entity';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getBooks(@Query('title') title: string): Promise<Book[]> {
    if (title) {
      return this.bookService.findByTitle(title);
    }
    return this.bookService.findAll();
  }
}
