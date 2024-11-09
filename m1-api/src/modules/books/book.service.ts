import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
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
}