import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ReactionService } from 'src/core/services/reactions/reaction.service';
import { CreateReactionDTO } from 'src/models/reaction/create.reaction.dto';
import { ReturnReviewDTO } from 'src/models/reviews/return.review.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/core/enum/user-role.enum';
import { Request } from 'express'
import { User } from 'src/models/users/user.entity';
import { IsBanGuard } from 'src/auth/ban.guard';
import { ReactionValue } from 'src/core/enum/reaction.enum';

@Controller('reactions')
export class ReactionController {
    constructor(
        private readonly reactionService: ReactionService,
    ) { }

    @UseGuards(AuthGuard('jwt'), IsBanGuard)
    @Post('books/reviews/:reviewId')
    async reaction(
        @Body() body: CreateReactionDTO,
        @Param('reviewId') reviewId: string,
        @Req() req: Request,
    ): Promise<Partial<ReturnReviewDTO>> {
        const user = req.user as User;

        return await this.reactionService.reaction(reviewId, user.id, Number(ReactionValue[body.reactionValue]))
    }


}
