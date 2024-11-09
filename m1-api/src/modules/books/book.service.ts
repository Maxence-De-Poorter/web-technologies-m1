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

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({ relations: ['author'] });
  }

  async findByTitle(title: string): Promise<Book[]> {
    return this.bookRepository.find({
      where: { title: Like(`%${title}%`) }, // Utilise LIKE pour une recherche partielle
      relations: ['author'],
    });
  }
}