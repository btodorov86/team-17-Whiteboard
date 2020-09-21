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
            relations: ['rectangles', 'invitedUsers', 'author']
        })

        if (!whiteboard) {
            throw new NotFoundException();
        }
        if (userId !== whiteboard.author.id || whiteboard.invitedUsers.find(x => x.id === userId)) {
            throw new UnauthorizedException();
        }

        const newRectangle = await this.rectangleRepo.save({
            itemPosition: whiteboard.rectangles.length + 1,
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
    async recover(rectangleId: string): Promise<string> {
        const rectangle = await this.rectangleRepo.findOne({
            where: { id: rectangleId, isDeleted: true }
        })
        if (!Rectangle) {
            throw new NotFoundException();
        }

        rectangle.isDeleted = false;

        return "item is recovered"
    }

}
