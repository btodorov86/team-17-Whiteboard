import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateLineDTO } from 'src/models/line/create.line.dto';
import { Line } from 'src/models/line/line.entity';
import { Repository } from 'typeorm';
import { Whiteboard } from 'src/models/whiteboard/whiteboard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReturnLineDTO } from 'src/models/line/return.line.dto';
import { TransformService } from '../transform/transform.service';
import { Comment } from 'src/models/comment/comment.entity';
import { CreateCommentDTO } from 'src/models/comment/create.comment.dto';
import { ReturnCommentDTO } from 'src/models/comment/return.comment.dto';

@Injectable()
export class CommentService {

    constructor (
        @InjectRepository(Whiteboard)
        private readonly whiteboardsRepo: Repository<Whiteboard>,
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
        private readonly transformService: TransformService,
    ) {}


    async create(whiteboardId: string, body: CreateCommentDTO, userId: string): Promise<ReturnCommentDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['lines', 'circles', 'rectangles', 'author', 'textBoxes', 'invitedUsers', 'comments']
        });

        if (!whiteboard) {
            throw new NotFoundException();
        }
            if (!whiteboard.isPublic && userId !== whiteboard.author.id && !whiteboard.invitedUsers.find(x => x.id === userId)) {
                throw new UnauthorizedException();
            }

        const newComment = await this.commentRepo.save({
            text: body.text,
            x: Number(body.x),
            y: Number(body.y),
        });

        whiteboard.comments.push(newComment);

        await this.whiteboardsRepo.save(whiteboard);

        return newComment


    }
    // async update(whiteboardId: string, body: Partial<CreateLineDTO>, lineId: string, userId: string): Promise<ReturnLineDTO> {
    //     const whiteboard = await this.whiteboardsRepo.findOne({
    //         where: { id: whiteboardId, isDeleted: false},
    //         relations: ['lines', 'invitedUsers', 'author']
    //     })
    //     if (!whiteboard) {
    //         throw new NotFoundException();
    //     }
    //     if (userId !== whiteboard.author.id || whiteboard.invitedUsers.find(x => x.id === userId)) {
    //         throw new UnauthorizedException();
    //     }

    //     const line = await this.lineRepo.findOne({
    //         where: { id: lineId, isDeleted: false }
    //     })

    //     if (!line) {
    //         throw new NotFoundException();
    //     }

    //     const returnLine = await this.lineRepo.save({...line, ...body, strokeWidth: Number(body.strokeWidth)})
    //     return this.transformService.toReturnLineDto(returnLine);

    // }
    // async delete(lineId: string): Promise<string> {
    //     const line = await this.lineRepo.findOne({
    //         where: { id: lineId, isDeleted: false }
    //     })
    //     if (!line) {
    //         throw new NotFoundException();
    //     }
    //     line.isDeleted = true;
    //     await this.lineRepo.save(line);

    //     return "item is Deleted"
    // }
    // async recover(lineId: string): Promise<ReturnLineDTO> {
    //     const line = await this.lineRepo.findOne({
    //         where: { id: lineId, isDeleted: true }
    //     });

    //     if (!line) {
    //         throw new NotFoundException();
    //     }
    //     line.isDeleted = false;

    //     return this.transformService.toReturnLineDto(await this.lineRepo.save(line))
    // }

}
