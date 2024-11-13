import { Controller, Get, Post, Body, Query, Param, NotFoundException, Delete, Put } from '@nestjs/common';
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

  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<Book> {
    const book = await this.bookService.findOne(id);
    if (!book) {
      throw new NotFoundException(`Livre avec l'ID ${id} non trouvé`);
    }
    return book;
  }

  @Post()
  async createBook(@Body() bookData: { title: string; year_published: number; price: number; author_id: number }): Promise<Book> {
    return this.bookService.createBook(bookData);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() bookData: { title: string; year_published: number; price: number }
  ): Promise<Book> {
    return this.bookService.updateBook(id, bookData);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<void> {
    await this.bookService.deleteBook(id);
  }
}
