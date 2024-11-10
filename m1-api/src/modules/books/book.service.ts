import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';

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

  async createBook(bookData: { title: string; year_published: number; author_id: number }): Promise<Book> {
    const author = await this.authorRepository.findOne({ where: { id: bookData.author_id.toString() } });
    if (!author) {
      throw new Error('Auteur non trouvé');
    }

    const newBook = this.bookRepository.create({
      title: bookData.title,
      year_published: bookData.year_published,
      author: author,
    });

    return this.bookRepository.save(newBook);
  }

  async findOne(id: string): Promise<Book | undefined> {
    return this.bookRepository.findOne({
      where: { id },
      relations: ['author'], // Inclure l'auteur pour les détails du livre
    });
  }

  async deleteBook(id: string): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Le livre avec l'ID ${id} n'existe pas.`);
    }
  }
}
