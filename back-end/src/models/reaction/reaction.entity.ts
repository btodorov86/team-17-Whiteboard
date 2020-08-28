import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Review } from '../reviews/review.entity';
import { User } from '../users/user.entity';
import { ReactionValue } from 'src/core/enum/reaction.enum';

@Entity('reactions')
export class Reaction {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @ManyToOne(type => Review, review => review.reaction)
    forReview: Review
    @ManyToOne(type => User, user => user.reaction)
    byUser: User
    @Column({type: 'enum', enum: ReactionValue})
    reactionValue: ReactionValue
}
