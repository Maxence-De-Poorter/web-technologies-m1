import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  // Récupère tous les livres avec les informations de l'auteur
  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({
      relations: ['author'], // Inclut les données de l'auteur
      select: {
        id: true,
        title: true,
        year_published: true,
        author: {
          first_name: true,
          last_name: true,
        },
      },
    });
  }
}