import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/book.entity';
import { BookService } from '../books/book.service';
import { BookController } from '../books/book.controller';
import { AuthorController } from '../authors/author.controller';
import { AuthorService } from '../authors/author.service';
import { Author } from '../authors/author.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Book, Author]),
  ],
  controllers: [BookController, AuthorController],
  providers: [BookService, AuthorService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
