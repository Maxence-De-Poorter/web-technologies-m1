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

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getBooks(
    @Query('title') title: string,
    @Query('author_id') authorId: string,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
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

  @Get('author/:authorId') // Nouveau point de terminaison pour récupérer les livres d'un auteur
  async getBooksByAuthor(@Param('authorId') authorId: string): Promise<Book[]> {
    return this.bookService.findBooksByAuthor(authorId);// Appel de la méthode dans le service
  }

  @Post()
  async createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.createBook(createBookDto);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<void> {
    await this.bookService.deleteBook(id);
  }
}
