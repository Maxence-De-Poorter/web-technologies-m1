import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  // Récupère tous les auteurs avec le comptage des livres
  async findAll(): Promise<any[]> {
    const authors = await this.authorRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.books', 'book')
      .select([
        'author.id',
        'author.first_name',
        'author.last_name',
        'author.photo',
      ])
      .addSelect('COUNT(book.id)', 'bookCount')
      .groupBy('author.id')
      .getRawMany();

    return authors.map(author => ({
      id: author.author_id,
      first_name: author.author_first_name,
      last_name: author.author_last_name,
      photo: author.author_photo,
      bookCount: parseInt(author.bookCount, 10),
    }));
  }

  // Récupère un auteur spécifique avec ses livres
  async findOne(id: string): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Auteur avec l'ID ${id} non trouvé`);
    }

    return author;
  }
}