import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Whiteboard } from 'src/models/whiteboard/whiteboard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCircleDTO } from 'src/models/Circle/create.Circle.dto';
import { ReturnCircleDTO } from 'src/models/Circle/return.Circle.dto';
import { Circle } from 'src/models/circle/circle.entity';

@Injectable()
export class CircleService {

    constructor (
        @InjectRepository(Whiteboard)
        private readonly whiteboardsRepo: Repository<Whiteboard>,
        @InjectRepository(Circle)
        private readonly circleRepo: Repository<Circle>,
    ) {}


    async create(whiteboardId: string, body: CreateCircleDTO): Promise<ReturnCircleDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['circles']
        })

        if (!whiteboard) {
            throw new NotFoundException();
        }

        const newCircle = await this.circleRepo.save({
            position: body.position,
            startX: body.startX,
            startY: body.startY,
            endX: body.endX,
            endY: body.endY,
            color: body.color,
            stroke: body.stroke,
            strokeWidth: Number(body.strokeWidth),
        });

        whiteboard.circles.push(newCircle);

        await this.whiteboardsRepo.save(whiteboard);

        return newCircle


    }
    async update(whiteboardId: string, body: Partial<CreateCircleDTO>, circleId: string): Promise<ReturnCircleDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['circles']
        })
        if (!whiteboard) {
            throw new NotFoundException();
        }

        const Circle = await this.circleRepo.findOne({
            where: { id: circleId, isDeleted: false }
        })

        if (!Circle) {
            throw new NotFoundException();
        }
        return await this.circleRepo.save({...Circle, ...body, strokeWidth: Number(body.strokeWidth)});

    }
    async delete(circleId: string): Promise<string> {
        const Circle = await this.circleRepo.findOne({
            where: { id: circleId, isDeleted: false }
        })
        if (!Circle) {
            throw new NotFoundException();
        }

        Circle.isDeleted = true;

        return "item is Deleted"
    }

}
