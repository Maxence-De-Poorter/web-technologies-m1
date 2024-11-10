import { Controller, Get, Post, Body, Query, Param, NotFoundException } from '@nestjs/common';
import { AuthorService } from './author.service';
import { Author } from './author.entity';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  async getAuthors(
    @Query('name') name: string,
    @Query('minBooks') minBooks: string,
  ): Promise<any[]> {
    return this.authorService.findAuthors(name, minBooks ? parseInt(minBooks, 10) : 0);
  }

  @Get(':id')
  async getAuthorById(@Param('id') id: string): Promise<Author> {
    const author = await this.authorService.findOne(id);
    if (!author) {
      throw new NotFoundException(`Auteur avec l'ID ${id} non trouvé`);
    }
    return author;
  }

  @Post()
  async createAuthor(@Body() authorData: { first_name: string; last_name: string; photo: string }): Promise<Author> {
    return this.authorService.createAuthor(authorData);
  }
}