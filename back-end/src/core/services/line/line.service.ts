import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLineDTO } from 'src/models/line/create.line.dto';
import { Line } from 'src/models/line/line.entity';
import { Repository } from 'typeorm';
import { Whiteboard } from 'src/models/whiteboard/whiteboard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReturnLineDTO } from 'src/models/line/return.line.dto';

@Injectable()
export class LineService {

    constructor (
        @InjectRepository(Whiteboard)
        private readonly whiteboardsRepo: Repository<Whiteboard>,
        @InjectRepository(Line)
        private readonly lineRepo: Repository<Line>,
    ) {}


    async create(whiteboardId: string, body: CreateLineDTO): Promise<ReturnLineDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['lines']
        })
        console.log(whiteboard);

        if (!whiteboard) {
            throw new NotFoundException();
        }

        const newLine = await this.lineRepo.save({
            points: body.points,
            color: body.color,
            stroke: body.stroke,
            strokeWidth: Number(body.strokeWidth),
        });

        whiteboard.lines.push(newLine);

        await this.whiteboardsRepo.save(whiteboard);

        return newLine


    }
    async update(whiteboardId: string, body: Partial<CreateLineDTO>, lineId: string): Promise<ReturnLineDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['lines']
        })
        if (!whiteboard) {
            throw new NotFoundException();
        }

        const line = await this.lineRepo.findOne({
            where: { id: lineId, isDeleted: false }
        })

        if (!line) {
            throw new NotFoundException();
        }
        return await this.lineRepo.save({...line, ...body, strokeWidth: Number(body.strokeWidth)});

    }
    async delete(lineId: string): Promise<string> {
        const line = await this.lineRepo.findOne({
            where: { id: lineId, isDeleted: false }
        })
        if (!line) {
            throw new NotFoundException();
        }

        line.isDeleted = true;

        return "item is Deleted"
    }

}
