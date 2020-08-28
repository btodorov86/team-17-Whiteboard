import { ReturnUserDTO } from '../users/return.user.dto'
import { ReturnBookDTO } from '../books/return.book.dto';

export class ReturnReviewDTO {
    id: string;
    contents: string;
    author: Partial<ReturnUserDTO>;
    forBook: Partial<ReturnBookDTO>;
    reaction: { like: number };
}
