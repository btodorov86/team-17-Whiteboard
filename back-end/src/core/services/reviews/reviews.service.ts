import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/models/reviews/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDTO } from 'src/models/reviews/create.review.dto';
import { ReturnReviewDTO } from 'src/models/reviews/return.review.dto';
import { TransformService } from '../transform/transform.service';
import { Book } from 'src/models/books/books.entity';
import { User } from 'src/models/users/user.entity';
import { UserRole } from 'src/core/enum/user-role.enum';
import { UpdateReviewDTO } from 'src/models/reviews/update.review.dto';
import { ReturnCreateReviewDTO } from 'src/models/reviews/return.create.review.dto';

@Injectable()
export class ReviewsService{
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,
        @InjectRepository(Book)
        private readonly bookRepo: Repository<Book>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly transform: TransformService
    ) {}

    async all(): Promise<Partial<ReturnReviewDTO>[]> {
        const reviews = await this.reviewRepo.find({
            where: { isDeleted: false },
            relations: ["reaction", "forBook", "author"]
        });

        return reviews.map(x => this.transform.toReturnReviewDto(x))
    }

    async getById(reviewId: string): Promise<Partial<ReturnReviewDTO>> {
        const review = await this.reviewRepo.findOne({
            where: { id: reviewId, isDeleted: false },
            relations: ["reaction", "forBook", "author"]
        });

        if (!review) {
            throw new NotFoundException(`Review with ID:${reviewId} don't exist`)
        }

        return this.transform.toReturnReviewDto(review)
    }

    async create(userId: string, bookId: string, body: CreateReviewDTO): Promise<ReturnCreateReviewDTO> {
        const review = new Review();
        review.contents = body.contents;
        const book = await this.bookRepo.findOne({
            where: { id: bookId, isDeleted: false },
            relations: ["bookReviews"]
        })
        if (!book) {
            throw new NotFoundException(`Book with id: ${bookId} is not exist`)
        }
        const user = await this.userRepo.findOne({
            where: { id: userId, isDeleted: false, isBanned: null },
        })
        if (!user) {
            throw new NotFoundException(`User with id: ${userId} does not exist`)
        }
        review.forBook = book;
        review.author = user;

        return this.transform.toReturnCreateReviewDto(await this.reviewRepo.save(review));

    }

    async update(reviewId: string, body: Partial<UpdateReviewDTO>, user: User): Promise<Partial<ReturnReviewDTO>> {
        if (!body.contents) {
            throw new BadRequestException('Invalid data input');
        }

        const review = await this.reviewRepo.findOne({
            where: { id: reviewId, isDeleted: false },
            relations: ["author", "forBook", "reaction"]
        })
        if (!review) {
            throw new NotFoundException(`Review with id: ${reviewId} does not exist`)
        }
        if (review.author.id !== user.id && user.role !== UserRole.Admin) {
            throw new UnauthorizedException('Not permission')
        }

        review.contents = body.contents;



        return this.transform.toReturnReviewDto( await this.reviewRepo.save(review))

    }

    async delete(reviewId: string, user: User): Promise<string> {

        const review = await this.reviewRepo.findOne({
            where: { id: reviewId, isDeleted: false },
            relations: ['author']
        })

        if (!review) {
            throw new NotFoundException(`Review with id: ${reviewId} is not exist`)
        }
        if (user.role !== UserRole.Admin && review.author.id !== user.id) {
            throw new UnauthorizedException('Not permission')
        }

        review.isDeleted = true;

        this.reviewRepo.save(review);

        return 'Review is deleted'
    }
    async unDelete(reviewId: string): Promise<string> {
        const review = await this.reviewRepo.findOne({
            where: { id: reviewId, isDeleted: true }
        })
        if (!review) {
            throw new NotFoundException(`Review with id: ${reviewId} is not exist`)
        }

        review.isDeleted = false,
        this.reviewRepo.save(review);

        return 'Review is restored'
    }

}
