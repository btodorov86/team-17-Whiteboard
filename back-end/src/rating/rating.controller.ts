import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { RatingService } from 'src/core/services/rating/rating.service';
import { CreateRatingDTO } from 'src/models/rating/create.rating.dto';
import { ReturnBookDTO } from 'src/models/books/return.book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/core/enum/user-role.enum';
import { Request } from 'express';
import { User } from 'src/models/users/user.entity';

@Controller('ratings')
export class RatingController {
    constructor(
        private readonly ratingService: RatingService,
    ) {}


    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.User))
    @Post('books/:bookId')
    public async rating(
        @Param('bookId') bookId: string,
        @Body() body: CreateRatingDTO,
        @Req() req: Request,
    ): Promise<Partial<ReturnBookDTO>> {
        const user = req.user as User;

        return await this.ratingService.addRating(user.id, bookId, Number(body.ratingValue));
    }
}
