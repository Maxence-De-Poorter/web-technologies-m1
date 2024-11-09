import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/book.entity';
import { BookService } from '../books/book.service';
import { BookController } from '../books/book.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Book]),
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

