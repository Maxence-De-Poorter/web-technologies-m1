import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  // Find authors with optional filters: name, minBooks, and order
  async findAuthors(
    name: string = '',
    minBooks: number = 0,
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<any[]> {
    const query = this.authorRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.books', 'book')
      .select([
        'author.id',
        'author.first_name',
        'author.last_name',
        'author.photo',
        'author.biography',
      ])
      .addSelect('COUNT(book.id)', 'bookCount') // Add the book count for each author
      .groupBy('author.id') // Group by author to aggregate the book count
      .orderBy('author.last_name', order); // Order by last name of the author

    // Filter by author name if provided
    if (name) {
      query.andWhere(
        'author.first_name LIKE :name OR author.last_name LIKE :name',
        { name: `%${name}%` },
      );
    }

    // Filter by minimum number of books if provided
    if (minBooks) {
      query.having('COUNT(book.id) >= :minBooks', { minBooks });
    }

    // Execute the query and return the raw results
    const authors = await query.getRawMany();

    // Map raw results to a structured format
    return authors.map((author) => ({
      id: author.author_id,
      first_name: author.author_first_name,
      last_name: author.author_last_name,
      photo: author.author_photo,
      biography: author.author_biography,
      bookCount: parseInt(author.bookCount, 10), // Parse book count as integer
    }));
  }

  // Find a single author by ID
  async findOne(id: string): Promise<Author | undefined> {
    // Use the repository to find the author by ID along with their books
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    // If no author is found, throw a NotFoundException
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }

  // Create a new author
  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const defaultPhotoUrl =
      'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Image-Background.png'; // Default photo URL

    // Create a new author entity using the provided DTO
    const newAuthor = this.authorRepository.create({
      ...createAuthorDto,
      last_name: createAuthorDto.last_name.toUpperCase(), // Ensure last name is uppercase
      photo: createAuthorDto.photo || defaultPhotoUrl, // Use provided photo or default photo
    });

    // Save and return the new author
    return this.authorRepository.save(newAuthor);
  }

  // Delete an author by ID
  async deleteAuthor(id: string): Promise<void> {
    // Attempt to delete the author by ID
    const result = await this.authorRepository.delete(id);
    if (result.affected === 0) {
      // If no author is deleted, throw a NotFoundException
      throw new NotFoundException(`Author with ID ${id} does not exist`);
    }
  }

  // Update an existing author's details
  async updateAuthor(
    id: string,
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    // Find the author by ID
    const author = await this.authorRepository.findOneBy({ id });
    if (!author) {
      // If no author is found, throw a NotFoundException
      throw new NotFoundException(`Author with ID ${id} does not exist`);
    }

    // Check if the photo is not provided, and if so, use the default photo
    if (!updateAuthorDto.photo) {
      updateAuthorDto.photo =
        'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Image-Background.png';
    }

    // Apply the updates to the author entity
    Object.assign(author, updateAuthorDto);

    // Save and return the updated author
    return this.authorRepository.save(author);
  }
}
