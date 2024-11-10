import { Controller, Get, Param } from '@nestjs/common';
import { AuthorService } from './author.service';
import { Author } from './author.entity';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  async getAllAuthors(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  @Get(':id')
  async getAuthorById(@Param('id') id: string): Promise<Author> {
    return this.authorService.findOne(id);
  }
}