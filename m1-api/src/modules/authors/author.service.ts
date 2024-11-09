import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  // Récupère tous les auteurs sans inclure les livres
  async findAll(): Promise<Author[]> {
    return this.authorRepository.find({
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });
  }

  // Récupère un auteur spécifique sans inclure les livres
  async findOne(id: string): Promise<Author> {
    return this.authorRepository.findOne({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });
  }
}