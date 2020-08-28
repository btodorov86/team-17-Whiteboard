import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from 'src/models/rating/rating.entity';
import { Repository } from 'typeorm';
import { Book } from 'src/models/books/books.entity';
import { User } from 'src/models/users/user.entity';
import { ValidatorService } from '../validator/validator.service';
import { TransformService } from '../transform/transform.service';
import { RatingValue } from 'src/core/enum/rating.enum';
import { ReturnBookDTO } from 'src/models/books/return.book.dto';

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(Rating)
        private readonly ratingRepo: Repository<Rating>,
        @InjectRepository(Book)
        private readonly bookRepo: Repository<Book>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly validator: ValidatorService,
        private readonly transform: TransformService,
    ) { }

    async addRating(userId: string, bookId: string, rating: RatingValue): Promise<Partial<ReturnBookDTO>> {
        this.validator.checkRatingValue(rating);
        const book = await this.bookRepo.findOne({
            where: { id: bookId, isDeleted: false },
            relations: ["returningUsers", "bookRating", "bookRating.user"],
        })
        if (!book) {
            throw new NotFoundException('Book does not exist');
        }
        if (!book.returningUsers.some(users => users.id === userId)) {
            throw new BadRequestException('User did not read this book')
        }
        if (book.bookRating.map( x => x.user.id).find( v => v === userId)) {
            throw new BadRequestException('User already gave rating on this book')
        }
        const user = await this.userRepo.findOne({
            where: { id: userId, isDeleted: false},
            relations: ["ratings"]
        })

        const ratingBook = new Rating();
        ratingBook.ratingValue = rating;
        ratingBook.book = book;
        ratingBook.user = user;

        return await this.ratingRepo.save(ratingBook);   //this.transform.toReturnBookDto(book, true)
    }


}
