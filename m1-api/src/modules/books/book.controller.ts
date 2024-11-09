import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.entity';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getBooks(
    @Query('title') title: string,
    @Query('author_id') authorId: string // Paramètre pour l'ID de l'auteur
  ): Promise<Book[]> {
    return this.bookService.findBooks(title, authorId);
  }
}