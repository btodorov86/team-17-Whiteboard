import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToMany } from 'typeorm'
import { User } from '../users/user.entity'
import { Review } from '../reviews/review.entity'
import { Rating } from '../rating/rating.entity'

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({length: 50, type: 'nvarchar'})
    header: string
    @Column({ unique: true, length: 50, type: 'nvarchar'})
    author: string
    @Column({ nullable: true })
    bookCover: string
    @Column({type: 'nvarchar'})
    contents: string
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    @ManyToMany(type => User, user => user.borrowedBooks)
    borrowingUsers: User[]
    @ManyToMany(type => User, user => user.readBooks)
    returningUsers: User[]
    @OneToMany(type => Review, review => review.forBook)
    bookReviews: Review[]
    @OneToMany(type => Rating, rating => rating.book)
    bookRating: Rating[]
}
