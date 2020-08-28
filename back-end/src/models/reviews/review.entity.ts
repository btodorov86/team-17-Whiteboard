import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne } from 'typeorm'
import { User } from '../users/user.entity'
import { Book } from '../books/books.entity'
import { Reaction } from '../reaction/reaction.entity'
@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({ type: 'nvarchar' })
    contents: string
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    // bookId: number
    @ManyToOne(type => User, user => user.reviews)
    author: User
    @ManyToOne(type => Book, book => book.bookReviews)
    forBook: Book
    @OneToMany(type => Reaction, reaction => reaction.forReview)
    reaction: Reaction[]

}
