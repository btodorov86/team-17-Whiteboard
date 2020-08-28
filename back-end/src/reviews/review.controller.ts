import { Controller, Get, Param, Post, Body, Delete, Put, Patch, ValidationPipe, UseGuards, Req } from "@nestjs/common";
import { ReturnReviewDTO } from "src/models/reviews/return.review.dto";
import { CreateReviewDTO } from "src/models/reviews/create.review.dto";
import { ReviewsService } from 'src/core/services/reviews/reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/core/enum/user-role.enum';
import { Request } from 'express';
import { User } from 'src/models/users/user.entity';
import { IsBanGuard } from 'src/auth/ban.guard';
import { UpdateReviewDTO } from 'src/models/reviews/update.review.dto';

@Controller('reviews')
export class ReviewsController {

    constructor(
        private readonly reviewService: ReviewsService
    ) { }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin), IsBanGuard)
    @Get('')
    public async all(): Promise<Partial<ReturnReviewDTO>[]> {
        return this.reviewService.all();
    }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin), IsBanGuard )
    @Get(':id')
    public getById(
        @Param('id') id: string,
        ): Promise<Partial<ReturnReviewDTO>> {
        return this.reviewService.getById(id)
    }

    @UseGuards(AuthGuard('jwt'), IsBanGuard)
    @Post('/books/:bookId')
    public async create(
        @Param('bookId') bookId: string,
        // @Param('userId') userId: string,
        @Body(new ValidationPipe({ whitelist: true })) body: CreateReviewDTO,
        @Req() req: Request,
        ): Promise<Partial<ReturnReviewDTO>> {
            const user = req.user as User;
        return await this.reviewService.create(user.id, bookId, body);
    }

    @UseGuards(AuthGuard('jwt'), IsBanGuard)
    @Delete(':id')
    public async delete(
        @Param('id') id: string,
        @Req() req: Request,
        ): Promise<string> {
            const user = req.user as User;
        return await this.reviewService.delete(id, user);
    }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin), IsBanGuard)
    @Patch(':id')
    public async unDelete(@Param('id') id: string): Promise<string> {
        return await this.reviewService.unDelete(id);
    }

    @UseGuards(AuthGuard('jwt'), IsBanGuard)
    @Put(':id')
    public async update(
        @Param('id') id: string,
        @Body(new ValidationPipe({ whitelist: true })) body: Partial<UpdateReviewDTO>,
        @Req() req: Request,
        ): Promise<Partial<ReturnReviewDTO>> {
            const user = req.user as User;
        return await this.reviewService.update(id, body, user);
    }

}
