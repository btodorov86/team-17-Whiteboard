import { Controller, Post, Body, Param, Put, Delete, ValidationPipe, UseGuards, Req, Patch } from '@nestjs/common';
import { CreateLineDTO } from 'src/models/line/create.line.dto';
import { ReturnLineDTO } from 'src/models/line/return.line.dto';
import { LineService } from 'src/core/services/line/line.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'src/models/users/user.entity';
import { Comment } from 'src/models/comment/comment.entity';
import { ReturnCommentDTO } from 'src/models/comment/return.comment.dto';
import { CommentService } from 'src/core/services/comment/comment.service';
import { CreateCommentDTO } from 'src/models/comment/create.comment.dto';


@Controller('whiteboards/:id/comments')

export class CommentsController {

    constructor(
        private readonly commentService: CommentService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(
        @Body(new ValidationPipe({whitelist: true})) body: CreateCommentDTO,
        @Req() req: Request,
        @Param('id') id: string
        ): Promise<ReturnCommentDTO> {
            console.log(body);
            
            const user = req.user as User;
        return await this.commentService.create(id, body, user.id)
    }

    // @UseGuards(AuthGuard('jwt'))
    // @Put(':lineId')
    // async update(
    //     @Param('id') id: string,
    //     @Req() req: Request,
    //     @Body(new ValidationPipe({whitelist: true})) body: Partial<CreateLineDTO>,
    //     @Param('lineId') lineId: string,
    //     ): Promise<ReturnLineDTO> {
    //         const user = req.user as User;
    //     return await this.commentService.update(id, body, lineId, user.id)
    // }

    // @Delete(':lineId')
    // async delete(
    //     @Param('lineId') lineId: string,
    //     ): Promise<string> {
    //     return this.commentService.delete(lineId)
    // }
    // @Patch(':lineId')
    // async recover(
    //     @Param('lineId') lineId: string,
    //     ): Promise<ReturnLineDTO> {

    //     return this.commentService.recover(lineId)
    // }

}
