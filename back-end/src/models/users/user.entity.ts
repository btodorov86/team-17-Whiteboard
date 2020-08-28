import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, JoinTable, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Book } from '../books/books.entity';
import { Review } from '../reviews/review.entity';
import { Rating } from '../rating/rating.entity';
import { UserRole } from 'src/core/enum/user-role.enum';
import { Reaction } from '../reaction/reaction.entity';
import { IsBanned } from '../isBanned/isBanned.entity';
import { UserLevel } from 'src/core/enum/user-level.enum';
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({unique: true, length: 10, type: 'nvarchar'})
    userName: string;
    @Column({ type: 'nvarchar'})
    firstName: string;
    @Column({ type: 'nvarchar'})
    lastName: string;
    @Column({unique: true})
    email: string;
    @Column()
    password: string;
    @Column({type: 'int', default: 0 })
    readPoints: number;
    @Column({type: 'enum', enum: UserRole, default: UserRole.User})
    role: UserRole;
    @Column({type: 'int', default: 0 })
    carmaPoints: number;
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    @JoinColumn()
    @OneToOne(type => IsBanned, isBan => isBan.owner)
    isBanned: IsBanned
    @JoinTable()
    @ManyToMany(type => Book, book => book.borrowingUsers)
    borrowedBooks: Book[]
    @JoinTable()
    @ManyToMany(type => Book, book => book.returningUsers)
    readBooks: Book[]
    @OneToMany(type => Review, review => review.author)
    reviews: Review[]
    @OneToMany(type => Rating, rating => rating.user)
    ratings: Rating[]
    @OneToMany(type => Reaction, reaction => reaction.byUser)
    reaction: Reaction[]
    @Column({ default: null, length: 1000 })
    token: string
    @Column({ type: 'enum', enum: UserLevel, default: UserLevel.Bronze})
    lvl: UserLevel
    @Column({nullable: true})
    avatarURL: string
}
