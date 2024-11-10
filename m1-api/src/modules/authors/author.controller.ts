import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { AuthorService } from './author.service';
import { Author } from './author.entity';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  async getAllAuthors(
    @Query('name') name?: string,
    @Query('minBooks') minBooks?: string,
  ): Promise<any[]> {
    const minBooksParsed = minBooks ? parseInt(minBooks, 10) : undefined;
    return this.authorService.findAll(name, minBooksParsed);
  }

  @Get(':id')
  async getAuthorById(@Param('id') id: string): Promise<Author> {
    const author = await this.authorService.findOne(id);
    if (!author) {
      throw new NotFoundException(`Auteur avec l'ID ${id} non trouvé`);
    }
    return author;
  }
}