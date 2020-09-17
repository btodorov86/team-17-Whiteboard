import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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


    async create(whiteboardId: string, body: CreateCircleDTO, userId: string): Promise<ReturnCircleDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['circles', 'invitedUsers', 'author']
        })

        if (!whiteboard) {
            throw new NotFoundException();
        }
        if (userId !== whiteboard.author.id || whiteboard.invitedUsers.find(x => x.id === userId)) {
            throw new UnauthorizedException();
        }

        const newCircle = await this.circleRepo.save({
            itemPosition: whiteboard.circles.length + 1,
            x: body.x,
            y: body.y,
            radius: body.radius,
            stroke: body.stroke,
            fill: body.fill,
            strokeWidth: Number(body.strokeWidth),
        });

        whiteboard.circles.push(newCircle);

        await this.whiteboardsRepo.save(whiteboard);

        return newCircle


    }
    async update(whiteboardId: string, body: Partial<CreateCircleDTO>, circleId: string, userId: string): Promise<ReturnCircleDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['circles', 'invitedUsers', 'author']
        })
        if (!whiteboard) {
            throw new NotFoundException();
        }
        if (userId !== whiteboard.author.id || whiteboard.invitedUsers.find(x => x.id === userId)) {
            throw new UnauthorizedException();
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
