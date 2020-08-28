import { ReturnUserDTO } from '../users/return.user.dto'
import { ReturnReviewDTO } from '../reviews/return.review.dto'
import { ReturnRatingDTO } from '../rating/return.rating.dto'

export class ReturnBookDTO {
    id: string
    header: string
    author: string
    contents: string
    bookCover: string
    borrowingUsers: Partial<ReturnUserDTO>[]
    returningUsers: Partial<ReturnUserDTO>[]
    bookReviews: Partial<ReturnReviewDTO>[]
    bookRating: ReturnRatingDTO //RatingValue[]
}
