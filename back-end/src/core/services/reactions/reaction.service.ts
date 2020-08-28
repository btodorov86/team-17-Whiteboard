import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from 'src/models/reaction/reaction.entity';
import { Review } from 'src/models/reviews/review.entity';
import { ReactionValue } from 'src/core/enum/reaction.enum';
import { User } from 'src/models/users/user.entity';
import { TransformService } from '../transform/transform.service';
import { Repository } from 'typeorm';
import { ValidatorService } from '../validator/validator.service';
import { ReturnReviewDTO } from 'src/models/reviews/return.review.dto';

@Injectable()
export class ReactionService {
    constructor(
        @InjectRepository(Reaction)
        private readonly reactionRepo: Repository<Reaction>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,
        private readonly transform: TransformService,
        private readonly validator: ValidatorService,
    ) { }

    async reaction(reviewId: string, userId: string, reaction: ReactionValue): Promise<Partial<ReturnReviewDTO>> {

        this.validator.checkReactionValue(reaction);

        const review = await this.reviewRepo.findOne({
            where: { id: reviewId, isDeleted: false },
            relations: ["reaction", "reaction.byUser", "author"],
        });
        if (!review) {
            throw new NotFoundException(`Review with id: ${reviewId} is not exist`)
        }
        const user = await this.userRepo.findOne({
            where: { id: userId, isDeleted: false }
        });

        if (!user) {
            throw new NotFoundException(`User with id: ${userId} is not exist`)
        }

        const isReaction = review.reaction.find(x => x.byUser.id === userId);
        if (isReaction) {
            if (isReaction.reactionValue === reaction) {
               await this.reactionRepo.delete(isReaction);
            }

            isReaction.reactionValue = reaction;
            await this.reactionRepo.save(isReaction);

        } else {
            const newReaction = new Reaction();
            newReaction.byUser = user;
            newReaction.forReview = review;
            newReaction.reactionValue = reaction;

            await this.reactionRepo.save(newReaction);
        }

        const result = await this.reviewRepo.findOne({
            where: { id: reviewId, isDeleted: false },
            relations: ["reaction", "author"],
        });

        return this.transform.toReturnCreateReviewDto(result)
    }
}
