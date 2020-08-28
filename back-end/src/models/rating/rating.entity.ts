import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/books.entity';
import { RatingValue } from 'src/core/enum/rating.enum';

@Entity('ratings')
export class Rating {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(type => Book, book => book.bookRating)
    book: Book;
    @ManyToOne(type => User, user => user.ratings)
    user: User;
    @Column({type: 'enum', enum: RatingValue})
    ratingValue: RatingValue;
}
