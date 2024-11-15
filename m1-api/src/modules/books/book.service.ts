import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable() // Marks the class as injectable in NestJS, so it can be injected into controllers
export class BookService {
  constructor(
    @InjectRepository(Book) // Injects the Book repository to interact with the Book entity
    private bookRepository: Repository<Book>,

    @InjectRepository(Author) // Injects the Author repository to interact with the Author entity
    private authorRepository: Repository<Author>,
  ) {}

  // Method to find books with optional filters: title, authorId, and order
  async findBooks(
    title?: string,
    authorId?: string,
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Book[]> {
    const where = {}; // Empty object to hold the conditions for the query

    if (title) {
      where['title'] = Like(`%${title}%`); // Search for books with titles that contain the 'title' string
    }
    if (authorId) {
      where['author'] = { id: authorId }; // Filter by author ID
    }

    // Find books matching the conditions
    return this.bookRepository.find({
      where,
      order: {
        year_published: order, // Sort by the year published in the specified order
      },
      relations: ['author'], // Include the author in the results
    });
  }

  // Method to find books by a specific author
  async findBooksByAuthor(authorId: string): Promise<Book[]> {
    return this.bookRepository.find({
      where: { author: { id: authorId } }, // Filter by author ID
      relations: ['author'], // Include the author in the results
    });
  }

  // Method to create a new book
  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    console.log('Received createBookDto:', createBookDto);

    const { title, year_published, price, author_id } = createBookDto; // Destructure DTO to extract data
    const author = await this.authorRepository.findOne({
      where: { id: author_id },
    }); // Find the author by ID

    if (!author) {
      throw new Error('Author not found'); // Throw an error if the author doesn't exist
    }

    const newBook = this.bookRepository.create({
      title,
      year_published,
      price,
      author, // Assign the found author to the book
    });

    console.log('Saving new book:', newBook);
    return this.bookRepository.save(newBook); // Save and return the newly created book
  }

  // Method to find a book by its ID
  async findOne(id: string): Promise<Book | undefined> {
    return this.bookRepository.findOne({
      where: { id },
      relations: ['author'], // Include the author in the book details
    });
  }

  // Method to update a book by its ID
  async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } }); // Find the book by ID
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`); // Throw an exception if the book doesn't exist
    }

    // Update fields only if provided in the DTO
    if (updateBookDto.title) {
      book.title = updateBookDto.title;
    }
    if (updateBookDto.year_published) {
      book.year_published = updateBookDto.year_published;
    }
    if (updateBookDto.price) {
      book.price = updateBookDto.price;
    }

    return this.bookRepository.save(book); // Save and return the updated book
  }

  // Method to delete a book by its ID
  async deleteBook(id: string): Promise<void> {
    const result = await this.bookRepository.delete(id); // Try to delete the book
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} does not exist.`); // Throw an exception if no rows were affected
    }
  }
}
