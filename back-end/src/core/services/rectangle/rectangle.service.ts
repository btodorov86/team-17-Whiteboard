import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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


    async create(whiteboardId: string, body: CreateRectangleDTO, userId: string): Promise<ReturnRectangleDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['lines', 'circles', 'rectangles', 'author', 'textBoxes', 'invitedUsers']
        })

        if (!whiteboard) {
            throw new NotFoundException();
        }
        if (!whiteboard.isPublic && userId !== whiteboard.author.id && !whiteboard.invitedUsers.find(x => x.id === userId)) {
            throw new UnauthorizedException();
        }

        const currentPosition = whiteboard.circles.length + whiteboard.lines.length + whiteboard.rectangles.length + whiteboard.textBoxes.length

        const newRectangle = await this.rectangleRepo.save({
            itemPosition: currentPosition + 1,
            x: body.x,
            y: body.y,
            height: body.height,
            width: body.width,
            stroke: body.stroke,
            fill: body.fill,
            strokeWidth: Number(body.strokeWidth),
        });

        whiteboard.rectangles.push(newRectangle);

        await this.whiteboardsRepo.save(whiteboard);

        return newRectangle


    }
    async update(whiteboardId: string, body: Partial<CreateRectangleDTO>, rectangleId: string, userId: string): Promise<ReturnRectangleDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['rectangles', 'invitedUsers', 'author']
        })
        if (!whiteboard) {
            throw new NotFoundException();
        }
        if (userId !== whiteboard.author.id || whiteboard.invitedUsers.find(x => x.id === userId)) {
            throw new UnauthorizedException();
        }

        const rectangle = await this.rectangleRepo.findOne({
            where: { id: rectangleId, isDeleted: false }
        })

        if (!rectangle) {
            throw new NotFoundException();
        }
        return await this.rectangleRepo.save({...rectangle, ...body, strokeWidth: Number(body.strokeWidth)});

    }
    async delete(rectangleId: string): Promise<ReturnRectangleDTO> {
        const rectangle = await this.rectangleRepo.findOne({
            where: { id: rectangleId, isDeleted: false }
        })
        if (!rectangle) {
            throw new NotFoundException();
        }
        rectangle.isDeleted = true;

        return await this.rectangleRepo.save(rectangle);
    }
    async recover(rectangleId: string): Promise<ReturnRectangleDTO> {
        const rectangle = await this.rectangleRepo.findOne({
            where: { id: rectangleId, isDeleted: true }
        });

        if (!rectangle) {
            throw new NotFoundException();
        }
        rectangle.isDeleted = false;

        return await this.rectangleRepo.save(rectangle);
    }

}
