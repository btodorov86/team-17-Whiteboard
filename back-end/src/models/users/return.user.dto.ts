import { ReturnBookDTO } from '../books/return.book.dto';
import { ReturnReviewDTO } from '../reviews/return.review.dto';
import { IsBanned } from '../isBanned/isBanned.entity';
import { UserLevel } from 'src/core/enum/user-level.enum';

export class ReturnUserDTO {
    id: string;
    firstName: string;
    lastName: string;
    email:string;
    userName: string;
    readPoints: number;
    carmaPoints: number;
    isBanned: null | IsBanned; //boolean
    borrowedBooks: Partial<ReturnBookDTO>[];
    readBooks: Partial<ReturnBookDTO>[];
    reviews: Partial<ReturnReviewDTO>[];
    lvl: UserLevel;
    role: string;
    avatarURL: string;
}
