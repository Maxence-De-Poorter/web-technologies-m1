import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async findBooks(title?: string, authorId?: string, order: 'ASC' | 'DESC' = 'DESC'): Promise<Book[]> {
    const where = {};

    if (title) {
      where['title'] = Like(`%${title}%`);
    }
    if (authorId) {
      where['author'] = { id: authorId };
    }

    return this.bookRepository.find({
      where,
      order: {
        year_published: order,
      },
      relations: ['author'],
    });
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    console.log('Received createBookDto:', createBookDto);

    const { title, year_published, price, author_id } = createBookDto;
    const author = await this.authorRepository.findOne({ where: { id: author_id } });

    if (!author) {
      throw new Error('Auteur non trouvé');
    }

    const newBook = this.bookRepository.create({
      title,
      year_published,
      price,
      author,
    });

    console.log('Saving new book:', newBook);
    return this.bookRepository.save(newBook);
  }

  async findOne(id: string): Promise<Book | undefined> {
    return this.bookRepository.findOne({
      where: { id },
      relations: ['author'], // Inclure l'auteur pour les détails du livre
    });
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Livre avec l'ID ${id} non trouvé`);
    }

    // Mettre à jour les champs uniquement s'ils sont fournis dans updateBookDto
    if (updateBookDto.title) {
      book.title = updateBookDto.title;
    }
    if (updateBookDto.year_published) {
      book.year_published = updateBookDto.year_published;
    }
    if (updateBookDto.price) {
      book.price = updateBookDto.price;
    }

    return this.bookRepository.save(book);
  }

  async deleteBook(id: string): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Le livre avec l'ID ${id} n'existe pas.`);
    }
  }
}