import { Controller, Get, Post, Put, Body, Query, Param, NotFoundException, Delete } from '@nestjs/common';
import { AuthorService } from './author.service';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  async getAuthors(
    @Query('name') name: string,
    @Query('minBooks') minBooks: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<any[]> {
    return this.authorService.findAuthors(name, minBooks ? parseInt(minBooks, 10) : 0, order);
  }

  @Get(':id')
  async getAuthorById(@Param('id') id: string): Promise<Author> {
    const author = await this.authorService.findOne(id);
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  @Post()
  async createAuthor(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorService.createAuthor(createAuthorDto);
  }

  @Delete(':id')
  async deleteAuthor(@Param('id') id: string): Promise<void> {
    await this.authorService.deleteAuthor(id);
  }

  @Put(':id')
  async updateAuthor(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return this.authorService.updateAuthor(id, updateAuthorDto);
  }
}