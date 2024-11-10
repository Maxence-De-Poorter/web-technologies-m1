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

  async findAuthors(name: string = "", minBooks: number = 0): Promise<any[]> {
    const query = this.authorRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.books', 'book')
      .select([
        'author.id',
        'author.first_name',
        'author.last_name',
        'author.photo',
      ])
      .addSelect('COUNT(book.id)', 'bookCount')
      .groupBy('author.id');

    if (name) {
      query.andWhere("author.first_name LIKE :name OR author.last_name LIKE :name", { name: `%${name}%` });
    }

    if (minBooks) {
      query.having('COUNT(book.id) >= :minBooks', { minBooks });
    }

    const authors = await query.getRawMany();

    return authors.map(author => ({
      id: author.author_id,
      first_name: author.author_first_name,
      last_name: author.author_last_name,
      photo: author.author_photo,
      bookCount: parseInt(author.bookCount, 10),
    }));
  }

  async findOne(id: string): Promise<Author | undefined> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Auteur avec l'ID ${id} non trouvé`);
    }

    return author;
  }

  async createAuthor(authorData: { first_name: string; last_name: string; photo?: string }): Promise<Author> {
    const defaultPhotoUrl = 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Image-Background.png';

    const newAuthor = this.authorRepository.create({
      first_name: authorData.first_name,
      last_name: authorData.last_name.toUpperCase(),
      photo: authorData.photo || defaultPhotoUrl,
    });

    return this.authorRepository.save(newAuthor);
  }
}