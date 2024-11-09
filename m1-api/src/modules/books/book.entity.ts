import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Author } from '../authors/author.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  year_published: number;

  @ManyToOne(() => Author, (author) => author.books, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: Author;
}