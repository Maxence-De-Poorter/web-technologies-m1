import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  // Get all authors, with optional filters like name, minBooks, and order
  @Get()
  async getAuthors(
    @Query('name') name: string, // Optional query parameter to filter authors by name
    @Query('minBooks') minBooks: string, // Optional query parameter to filter authors by minimum number of books
    @Query('order') order: 'ASC' | 'DESC' = 'ASC', // Optional query parameter for sorting order (default is 'ASC')
  ): Promise<any[]> {
    // Call the service method to get authors based on the filters and return the result
    return this.authorService.findAuthors(
      name,
      minBooks ? parseInt(minBooks, 10) : 0,
      order,
    );
  }

  // Get a specific author by their ID
  @Get(':id')
  async getAuthorById(@Param('id') id: string): Promise<Author> {
    // Find the author by ID using the service
    const author = await this.authorService.findOne(id);
    if (!author) {
      // If the author is not found, throw a NotFoundException with a custom message
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author; // Return the author data if found
  }

  // Create a new author using the provided data in the request body
  @Post()
  async createAuthor(
    @Body() createAuthorDto: CreateAuthorDto,
  ): Promise<Author> {
    // Call the service to create a new author and return the result
    return this.authorService.createAuthor(createAuthorDto);
  }

  // Delete an author by their ID
  @Delete(':id')
  async deleteAuthor(@Param('id') id: string): Promise<void> {
    // Call the service to delete the author and return nothing (void)
    await this.authorService.deleteAuthor(id);
  }

  // Update an existing author's details by their ID
  @Put(':id')
  async updateAuthor(
    @Param('id') id: string, // Author's ID to be updated
    @Body() updateAuthorDto: UpdateAuthorDto, // New data for updating the author
  ): Promise<Author> {
    // Call the service to update the author's details and return the updated author
    return this.authorService.updateAuthor(id, updateAuthorDto);
  }
}
