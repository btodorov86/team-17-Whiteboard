import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateLineDTO } from 'src/models/line/create.line.dto';
import { Line } from 'src/models/line/line.entity';
import { Repository } from 'typeorm';
import { Whiteboard } from 'src/models/whiteboard/whiteboard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReturnLineDTO } from 'src/models/line/return.line.dto';
import { TransformService } from '../transform/transform.service';

@Injectable()
export class LineService {

    constructor (
        @InjectRepository(Whiteboard)
        private readonly whiteboardsRepo: Repository<Whiteboard>,
        @InjectRepository(Line)
        private readonly lineRepo: Repository<Line>,
        private readonly transformService: TransformService,
    ) {}


    async create(whiteboardId: string, body: CreateLineDTO, userId: string): Promise<ReturnLineDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['lines', 'circles', 'rectangles', 'author', 'textBoxes', 'invitedUsers']
        });

        if (!whiteboard) {
            throw new NotFoundException();
        }
        if (userId !== whiteboard.author.id && !whiteboard.invitedUsers.find(x => x.id === userId)) {
            throw new UnauthorizedException();
        }

        const currentPosition = whiteboard.circles.length + whiteboard.lines.length + whiteboard.rectangles.length + whiteboard.textBoxes.length

        const newLine = await this.lineRepo.save({
            itemPosition: currentPosition + 1,
            points: body.points,
            stroke: body.stroke,
            strokeWidth: Number(body.strokeWidth),
        });

        whiteboard.lines.push(newLine);

        await this.whiteboardsRepo.save(whiteboard);

        return this.transformService.toReturnLineDto(newLine)


    }
    async update(whiteboardId: string, body: Partial<CreateLineDTO>, lineId: string, userId: string): Promise<ReturnLineDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['lines', 'invitedUsers', 'author']
        })
        if (!whiteboard) {
            throw new NotFoundException();
        }
        if (userId !== whiteboard.author.id || whiteboard.invitedUsers.find(x => x.id === userId)) {
            throw new UnauthorizedException();
        }

        const line = await this.lineRepo.findOne({
            where: { id: lineId, isDeleted: false }
        })

        if (!line) {
            throw new NotFoundException();
        }

        const returnLine = await this.lineRepo.save({...line, ...body, strokeWidth: Number(body.strokeWidth)})
        return this.transformService.toReturnLineDto(returnLine);

    }
    async delete(lineId: string): Promise<string> {
        const line = await this.lineRepo.findOne({
            where: { id: lineId, isDeleted: false }
        })
        if (!line) {
            throw new NotFoundException();
        }
        line.isDeleted = true;
        await this.lineRepo.save(line);

        return "item is Deleted"
    }
    async recover(lineId: string): Promise<ReturnLineDTO> {
        const line = await this.lineRepo.findOne({
            where: { id: lineId, isDeleted: true }
        });

        if (!line) {
            throw new NotFoundException();
        }
        line.isDeleted = false;

        return this.transformService.toReturnLineDto(await this.lineRepo.save(line))
    }

}
