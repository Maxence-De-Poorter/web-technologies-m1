import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.entity';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getBooks(
    @Query('title') title: string,
    @Query('author_id') authorId: string,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC'
  ): Promise<Book[]> {
    return this.bookService.findBooks(title, authorId, order);
  }

  @Post()
  async createBook(@Body() bookData: { title: string; year_published: number; author_id: number }): Promise<Book> {
    return this.bookService.createBook(bookData);
  }
}
