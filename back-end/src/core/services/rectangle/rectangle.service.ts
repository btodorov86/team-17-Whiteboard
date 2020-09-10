import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Whiteboard } from 'src/models/whiteboard/whiteboard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Rectangle } from 'src/models/rectangle/rectangle.entity';
import { CreateRectangleDTO } from 'src/models/rectangle/create.rectangle.dto';
import { ReturnRectangleDTO } from 'src/models/rectangle/return.rectangle.dto';

@Injectable()
export class RectangleService {

    constructor (
        @InjectRepository(Whiteboard)
        private readonly whiteboardsRepo: Repository<Whiteboard>,
        @InjectRepository(Rectangle)
        private readonly rectangleRepo: Repository<Rectangle>,
    ) {}


    async create(whiteboardId: string, body: CreateRectangleDTO): Promise<ReturnRectangleDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['rectangles']
        })

        if (!whiteboard) {
            throw new NotFoundException();
        }

        const newRectangle = await this.rectangleRepo.save({
            startX: body.startX,
            startY: body.startY,
            endX: body.endX,
            endY: body.endY,
            color: body.color,
            stroke: body.stroke,
            strokeWidth: Number(body.strokeWidth),
        });

        whiteboard.rectangles.push(newRectangle);

        await this.whiteboardsRepo.save(whiteboard);

        return newRectangle


    }
    async update(whiteboardId: string, body: Partial<CreateRectangleDTO>, rectangleId: string): Promise<ReturnRectangleDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['rectangles']
        })
        if (!whiteboard) {
            throw new NotFoundException();
        }

        const rectangle = await this.rectangleRepo.findOne({
            where: { id: rectangleId, isDeleted: false }
        })

        if (!rectangle) {
            throw new NotFoundException();
        }
        return await this.rectangleRepo.save({...rectangle, ...body, strokeWidth: Number(body.strokeWidth)});

    }
    async delete(rectangleId: string): Promise<string> {
        const rectangle = await this.rectangleRepo.findOne({
            where: { id: rectangleId, isDeleted: false }
        })
        if (!Rectangle) {
            throw new NotFoundException();
        }

        rectangle.isDeleted = true;

        return "item is Deleted"
    }

}
