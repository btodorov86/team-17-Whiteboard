import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/models/books/books.entity';
import { Repository } from 'typeorm';
import { TransformService } from '../transform/transform.service';
import { ValidatorService } from '../validator/validator.service';
import { ReturnBookDTO } from 'src/models/books/return.book.dto';
import { CreateBookDTO } from 'src/models/books/create.book.dto';
import { UpdateBookDTO } from 'src/models/books/update.book.dto';
import { User } from 'src/models/users/user.entity';
import { UserLevelService } from '../level/user-level.service';
import { ReadingPoints } from 'src/core/enum/reading-points.enum';

@Injectable()
export class BooksService{
    constructor(
        @InjectRepository(Book)
        private readonly bookRepo: Repository<Book>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly validator: ValidatorService,
        private readonly transform: TransformService,
        private readonly userLevel: UserLevelService,
    ) {}

    async all(): Promise<Partial<ReturnBookDTO>[]> {
        const books =  await this.bookRepo.find({
            where: { isDeleted: false },
            relations: [ "borrowingUsers", "returningUsers", "bookReviews", "bookRating", "bookReviews.reaction", "bookRating.user", "bookReviews.author"]
        });
        return books.map(book => this.transform.toReturnBookDto(book));
    }
    async allByQuery(header?: string, author?: string): Promise<Partial<ReturnBookDTO>[]> {
        if (header && author) {
            const books =  await this.bookRepo.find({
                where: { header: header, author: author, isDeleted: false },
                relations: [ "borrowingUsers", "returningUsers", "bookReviews", "bookRating", "bookReviews.reaction", "bookReviews.author"],
            });
            if (books.length === 0) {
                throw new NotFoundException(`Books with header: ${header} and author: ${author} not exist`)
            }
            return books.map(book => this.transform.toReturnBookDto(book));
        } else if (author) {
            const books =  await this.bookRepo.find({
                where: { author: author ,isDeleted: false },
                relations: [ "borrowingUsers", "returningUsers", "bookReviews", "bookRating", "bookReviews.reaction", "bookReviews.author"]
            });
            if (books.length === 0) {
                throw new NotFoundException(`Book with author: ${author} does not exist`)
            }
            return books.map(book => this.transform.toReturnBookDto(book));
        } else if (header) {
            const books =  await this.bookRepo.find({
                where: { header: header, isDeleted: false },
                relations: [ "borrowingUsers", "returningUsers", "bookReviews", "bookRating", "bookReviews.reaction", "bookReviews.author"]
            });
            if (books.length === 0) {
                throw new NotFoundException(`Book with header: ${header} does not exist`)
            }
            return books.map(book => this.transform.toReturnBookDto(book));
        }
    }

    async create(body: CreateBookDTO): Promise<Partial<ReturnBookDTO>> {
        this.validator.string(body.author, 2, 50);
        this.validator.string(body.header, 2, 50);
        const book = this.bookRepo.create(body);
        return this.transform.toReturnBookDto(await this.bookRepo.save(book), true)
    }

    async delete(bookId: string): Promise<string> {
        const book: Book = await this.bookRepo.findOne(bookId);
        if (!book || book.isDeleted === true) {
            throw new NotFoundException(`Book with id: ${bookId} does not exist`);
        }
        book.isDeleted = true;
        this.bookRepo.save(book);

        return 'Book is deleted'
    }
    async unDelete(bookId: string): Promise<string> {
        const book: Book = await this.bookRepo.findOne(bookId);
        if (!book) {
            throw new NotFoundException(`Book with id: ${bookId} does not exist`);
        }
        book.isDeleted = false;
        this.bookRepo.save(book);

        return 'Book is restored'
    }

    async getOne(bookId: string): Promise<Partial<ReturnBookDTO>> {
        const book = await this.bookRepo.findOne({
            where: { id: bookId, isDeleted: false },
            relations: ["borrowingUsers", "returningUsers", "bookReviews", "bookRating", "bookReviews.reaction", "bookRating.user", "bookReviews.author"],
        });
        if (!book || book.isDeleted === true) {
            throw new NotFoundException(`Book with id: ${bookId} does not exist`);
        }

        return this.transform.toReturnBookDto(book)
    }

    async update(bookId: string, body: Partial<UpdateBookDTO>): Promise<Partial<ReturnBookDTO>> {
        const book = await this.bookRepo.findOne({
            where: { id: bookId, isDeleted: false },
            relations: ["borrowingUsers", "returningUsers", "bookReviews", "bookRating", "bookReviews.reaction", "bookReviews.author"],
        });
        if (!book) {
            throw new NotFoundException(`Book with id: ${bookId} does not exist`);
        }
        // if (body.author) {
        //     this.validator.string(body.author, 2, 10);
        //     book.author = body.author;
        // }
        // if (body.header) {
        //     this.validator.string(body.header, 2, 10);
        //     book.header = body.header;
        // }
        // if (body.contents) {
        //     this.validator.string(body.contents, 2, 500);
        //     book.contents = body.contents;
        // }
        // await this.bookRepo.update(book, body);
        await this.bookRepo.save({...book, ...body});

        return this.transform.toReturnBookDto(book)
    }
    async borrow(userId: string, bookId: string): Promise<string> {
        const user = await this.userRepo.findOne({
            where: { id: userId, isDeleted: false },
            relations: ["borrowedBooks"],
        })
        if (!user) {
            throw new NotFoundException('User does not exist');
        }
        const book = await this.bookRepo.findOne({
            where: { id: bookId, isDeleted: false }
        })
        if (!book) {
            throw new NotFoundException('Book does not exist');
        }
        if (user.borrowedBooks.some( borrowedBook => borrowedBook.id === book.id)) {
            throw new NotFoundException(`${user.userName} has already borrowed book: ${book.header}`);
        }

        user.borrowedBooks.push(book);
        this.userRepo.save(user);

        return `Book with id: ${bookId} is borrowed`
    }
    async returnBook(userId: string, bookId: string): Promise<string> {
        const user = await this.userRepo.findOne({
            where: { id: userId, isDeleted: false, isBanned: null },
            relations: ["borrowedBooks", "readBooks"],
        })
        if (!user) {
            throw new NotFoundException('User does not exist');
        }
        const book = await this.bookRepo.findOne({
            where: { id: bookId, isDeleted: false }
        })
        if (!book) {
            throw new NotFoundException('Book does not exist');
        }
        if (!user.borrowedBooks.some( borrowedBook => borrowedBook.id === book.id)) {
            throw new NotFoundException(`${user.userName} has not borrowed book: ${book.header}`);
        }

        user.borrowedBooks = user.borrowedBooks.filter(borrowedBook => borrowedBook.id !== book.id);
        user.readBooks.push(book);


        await this.userLevel.levelUp(await this.userRepo.save(user), ReadingPoints.Basic);


        return `Book with id: ${bookId} is returned`
    }

    async uploadCover(id: string, filename: string): Promise<Partial<ReturnBookDTO>> {
        const book = await this.bookRepo.findOne({
            where: { id: id, isDeleted: false }
        });

        book.bookCover = filename;
        this.bookRepo.save(book)

        return this.transform.toReturnBookDto(book, true)
    }

}
