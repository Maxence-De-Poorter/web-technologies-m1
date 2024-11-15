import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  NotFoundException,
  Delete,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books') // Books endpoint
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // Get a list of books, optionally filtered by title, authorId, and sorted by order
  @Get()
  async getBooks(
    @Query('title') title: string,
    @Query('author_id') authorId: string,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Book[]> {
    return this.bookService.findBooks(title, authorId, order); // Call the service method to find books
  }

  // Get a single book by ID
  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<Book> {
    const book = await this.bookService.findOne(id); // Call the service method to find the book by ID
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`); // Throw an exception if the book is not found
    }
    return book;
  }

  // New endpoint to get books by author ID
  @Get('author/:authorId')
  async getBooksByAuthor(@Param('authorId') authorId: string): Promise<Book[]> {
    return this.bookService.findBooksByAuthor(authorId); // Call the service method to get books by author
  }

  // Create a new book
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.createBook(createBookDto); // Call the service method to create a new book
  }

  // Update an existing book by ID
  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateBook(id, updateBookDto); // Call the service method to update the book
  }

  // Delete a book by ID
  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<void> {
    await this.bookService.deleteBook(id); // Call the service method to delete the book
  }
}
