import { Injectable } from '@nestjs/common';
import { User } from 'src/models/users/user.entity';
import { ReturnUserDTO } from 'src/models/users/return.user.dto';
import { Book } from 'src/models/books/books.entity';
import { ReturnBookDTO } from 'src/models/books/return.book.dto';
import { Review } from 'src/models/reviews/review.entity';
import { ReturnReviewDTO } from 'src/models/reviews/return.review.dto';
import { Rating } from 'src/models/rating/rating.entity';
import { Reaction } from 'src/models/reaction/reaction.entity';
import { UserRole } from 'src/core/enum/user-role.enum';
import { ReturnRatingDTO } from 'src/models/rating/return.rating.dto';
import { ReturnCreateReviewDTO } from 'src/models/reviews/return.create.review.dto';

@Injectable()
export class TransformService {

  toReturnCreateReviewDto(review: Review): ReturnCreateReviewDTO {
    return {
      id: review.id,
      contents: review.contents,
    }
  }
  toReturnReviewDto(review: Review, token = false): Partial<ReturnReviewDTO> {
    if (token) {
      return {
        id: review.id,
        contents: review.contents,
        reaction: this.toReturnReactionDto(review.reaction),
        author: this.toReturnUserDto(review.author, true),
        // author: review.author.userName,
        // reaction: this.toReturnReactionDto(review.reaction),
        // reaction: { like: this.toReturnReactionDto(review.reaction) },
        // reaction: { like: review.reaction.map( x => x.reactionValue).reduce((a, b) => a + b) },
      };
    }
    return {
      id: review.id,
      contents: review.contents,
      author: this.toReturnUserDto(review.author, true),
      forBook: this.toReturnBookDto(review.forBook, true),
      reaction: this.toReturnReactionDto(review.reaction),
    };
  }
  toReturnBookDto(book: Book, token = false): Partial<ReturnBookDTO> {
    if (token) {
      return {
        id: book.id,
        header: book.header,
        author: book.author,
        contents: book.contents,
        bookCover: book.bookCover,
      };
    }
    return {
      id: book.id,
      header: book.header,
      author: book.author,
      contents: book.contents,
      bookCover: book.bookCover,
      borrowingUsers: book.borrowingUsers.map(user =>
        this.toReturnUserDto(user, true),
      ),
      returningUsers: book.returningUsers.map(user =>
        this.toReturnUserDto(user, true),
      ),
      bookReviews: book.bookReviews
        .filter(x => x.isDeleted === false)
        .map(review => this.toReturnReviewDto(review, true)),

      bookRating: this.toReturnRatingDto(book.bookRating),
    };
  }

  toReturnUserDto(user: User, token = false): Partial<ReturnUserDTO> {
    if (token) {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userName: user.userName,
        readPoints: user.readPoints,
        carmaPoints: user.carmaPoints,
        isBanned: user.isBanned,
        lvl: user.lvl,
        role: UserRole[user.role],
        avatarURL: user.avatarURL,

      };
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      readPoints: user.readPoints,
      carmaPoints: user.carmaPoints,
      isBanned: user.isBanned, //user.isBanned === null ? false : true,
      lvl: user.lvl,
      role: UserRole[user.role],
      avatarURL: user.avatarURL,
      borrowedBooks: user.borrowedBooks.map(book =>
        this.toReturnBookDto(book, true),
      ),
      readBooks: user.readBooks.map(book => this.toReturnBookDto(book, true)),
      reviews: user.reviews
        .filter(x => x.isDeleted === false)
        .map(review => this.toReturnReviewDto(review, true)),
    };
  }

  private toReturnRatingDto(value: Rating[]): ReturnRatingDTO {

    const ratingLength = value.length;
    if (ratingLength !== 0) {
      const ratingValue =
        value.map(x => x.ratingValue).reduce((a, b) => a + b) / ratingLength;
      const usersIds = value.map(x => x.user.id);

      return {
        ratingValue,
        userId: usersIds,
      };
    }

    return {
        ratingValue: 0,
        userId: []
    }
  }
  private toReturnReactionDto(
    value: Reaction[],
  ): { like: number; dislike: number; love: number } {
    return {
      like: value.filter(x => x.reactionValue === 1).length,
      dislike: value.filter(x => x.reactionValue === 2).length,
      love: value.filter(x => x.reactionValue === 3).length,
    };

    // return reactionObj
  }
}
