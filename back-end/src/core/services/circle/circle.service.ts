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
            relations: ['lines', 'circles', 'rectangles', 'author', 'textBoxes', 'invitedUsers']
        });

        if (!whiteboard) {
            throw new NotFoundException();
        }
        if (!whiteboard.isPublic && userId !== whiteboard.author.id && !whiteboard.invitedUsers.find(x => x.id === userId)) {
            throw new UnauthorizedException();
        }

        const currentPosition = whiteboard.circles.length + whiteboard.lines.length + whiteboard.rectangles.length + whiteboard.textBoxes.length

        const newCircle = await this.circleRepo.save({
            itemPosition: currentPosition + 1,
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
        if (userId !== whiteboard.author.id && !whiteboard.invitedUsers.find(x => x.id === userId)) {

            throw new UnauthorizedException();
        }

        const circle = await this.circleRepo.findOne({
            where: { id: circleId, isDeleted: false }
        })

        if (!circle) {
            throw new NotFoundException();
        }
        return await this.circleRepo.save({...circle, ...body, strokeWidth: Number(body.strokeWidth)});

    }
    async delete(circleId: string): Promise<ReturnCircleDTO> {
        const circle = await this.circleRepo.findOne({
            where: { id: circleId, isDeleted: false }
        })
        if (!circle) {
            throw new NotFoundException();
        }
        circle.isDeleted = true;

        return await this.circleRepo.save(circle);
    }
    async recover(circleId: string): Promise<ReturnCircleDTO> {
        const circle = await this.circleRepo.findOne({
            where: { id: circleId, isDeleted: true }
        });

        if (!circle) {
            throw new NotFoundException();
        }
        circle.isDeleted = false;

        return await this.circleRepo.save(circle);
    }

}
