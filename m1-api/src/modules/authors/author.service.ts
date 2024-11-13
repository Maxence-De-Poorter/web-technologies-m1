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

  async findAuthors(name: string = "", minBooks: number = 0, order: 'ASC' | 'DESC' = 'ASC'): Promise<any[]> {
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
      .addSelect('COUNT(book.id)', 'bookCount')
      .groupBy('author.id')
      .orderBy('author.last_name', order);

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
      biography: author.author_biography,
      bookCount: parseInt(author.bookCount, 10),
    }));
  }

  async findOne(id: string): Promise<Author | undefined> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    return author;
  }

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const defaultPhotoUrl = 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Image-Background.png';

    const newAuthor = this.authorRepository.create({
      ...createAuthorDto,
      last_name: createAuthorDto.last_name.toUpperCase(),
      photo: createAuthorDto.photo || defaultPhotoUrl,
    });

    return this.authorRepository.save(newAuthor);
  }

  async deleteAuthor(id: string): Promise<void> {
    const result = await this.authorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Author with ID ${id} does not exist`);
    }
  }

  async updateAuthor(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.authorRepository.findOneBy({ id });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} does not exist`);
    }
    Object.assign(author, updateAuthorDto);
    return this.authorRepository.save(author);
  }
}