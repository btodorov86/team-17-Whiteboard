import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ReturnWhiteboardDTO } from 'src/models/whiteboard/return.whiteboard.dto';
import { Whiteboard } from 'src/models/whiteboard/whiteboard.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransformService } from '../transform/transform.service';
import { User } from 'src/models/users/user.entity';
import { ReturnCreatedWhiteboardDTO } from 'src/models/whiteboard/return.created.whiteboard.dto';
import { SimpleReturnWhiteboardDTO } from 'src/models/whiteboard/simple.return.whiteboard.dto';
import { UpdateWhiteboardDTO } from 'src/models/whiteboard/update.whiteboard.dto';

@Injectable()
export class WhiteBoardService{

    constructor(
        @InjectRepository(Whiteboard)
        private readonly whiteboardsRepo: Repository<Whiteboard>,
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
        private readonly transform: TransformService,
      ) {}


    async getOne(id: string): Promise<ReturnWhiteboardDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: id, isDeleted: false},
            relations: ['lines', 'circles', 'rectangles', 'author', 'textBoxes']
        })
        if(!whiteboard) {
            throw new NotFoundException();
        }

        return this.transform.toReturnWhiteboardDto(whiteboard)
    }
    async getAllPublic(): Promise<ReturnWhiteboardDTO[]> {
        const whiteboard = await this.whiteboardsRepo.find({
            where: { isPublic: true, isDeleted: false},
            relations: ['lines', 'circles', 'rectangles', 'author', 'textBoxes']
        })

        if(whiteboard.length === 0) {

            throw new NotFoundException();
        }

        return whiteboard.map( board => this.transform.toReturnWhiteboardDto(board))
    }
    async getAllPrivate(userId: string): Promise<SimpleReturnWhiteboardDTO[]> {

        const user = await this.usersRepo.findOne({
            where: { id: userId, isDeleted: false},
            relations: ['whiteboards', 'whiteboards.author', 'canUpdate', 'canUpdate.author']
        })

        if(!user) {
            throw new NotFoundException();
        }

        const result = [...user.whiteboards, ...user.canUpdate];

        return result.filter( x => x.isPublic === false).map( x => ({
            id: x.id,
            name: x.name,
            isPublic: x.isPublic,
            author: x.author.id
        }))
    }


    async create(name: string, isPublic: boolean, userId: string): Promise<ReturnCreatedWhiteboardDTO> {
        const user = await this.usersRepo.findOne({
            where: { id: userId, isDeleted: false },
            relations: ['whiteboards']
        })
        if(!user) {
            throw new NotFoundException();
        }

        const whiteboard: Whiteboard = await this.whiteboardsRepo.save({
            isPublic,
            name
        })
        user.whiteboards.push(whiteboard)
        await this.usersRepo.save(user);

        return this.transform.toReturnCreatedWhiteboardDto(whiteboard, user)
    }
    async delete(id: string, userId: string): Promise<string> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: id, isDeleted: false},
            relations: ['author']
        })
        if(!whiteboard) {
            throw new NotFoundException();
        }
        if (whiteboard.author.id !== userId) {
            throw new UnauthorizedException()
        }
        whiteboard.isDeleted = true;
        this.whiteboardsRepo.save(whiteboard)
        return 'Board is deleted'
    }
    async update(id: string, body: Partial<UpdateWhiteboardDTO>, whiteboardId: string): Promise<SimpleReturnWhiteboardDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false},
            relations: ['invitedUsers', 'author']
        })
        if(!whiteboard) {
            throw new NotFoundException();
        }
        if(whiteboard.author.id !== id) {
            throw new UnauthorizedException();
        }
        if (body.invitedUsersId) {
            const invitedUser = await this.usersRepo.findOne({
                where: { id: body.invitedUsersId, isDeleted: false}
            });
            whiteboard.invitedUsers.push(invitedUser);
        }

        body?.name ? whiteboard.name = body.name : null;
        body?.isPublic ? whiteboard.isPublic = body.isPublic : null;

        return this.transform.toSimpleReturnWhiteboardDto(await this.whiteboardsRepo.save(whiteboard), whiteboard.author)
    }

}
