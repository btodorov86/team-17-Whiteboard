import { HttpException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ReturnWhiteboardDTO } from 'src/models/whiteboard/return.whiteboard.dto';
import { Whiteboard } from 'src/models/whiteboard/whiteboard.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransformService } from '../transform/transform.service';
import { User } from 'src/models/users/user.entity';
import { ReturnCreatedWhiteboardDTO } from 'src/models/whiteboard/return.created.whiteboard.dto';
import { SimpleReturnWhiteboardDTO } from 'src/models/whiteboard/simple.return.whiteboard.dto';
import { UpdateWhiteboardDTO } from 'src/models/whiteboard/update.whiteboard.dto';
import { ReturnUserDTO } from 'src/models/users/return.user.dto';

@Injectable()
export class WhiteBoardService{

    constructor(
        @InjectRepository(Whiteboard)
        private readonly whiteboardsRepo: Repository<Whiteboard>,
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
        private readonly transform: TransformService,
      ) {}


    async getOne(id: string, userId: string): Promise<ReturnWhiteboardDTO> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: id, isDeleted: false},
            relations: ['lines', 'circles', 'rectangles', 'author', 'textBoxes', 'invitedUsers', 'comments']
        })

        if(!whiteboard) {
            throw new NotFoundException();
        }
        if (!whiteboard.isPublic) {
            if (whiteboard.author.id !== userId && !whiteboard.invitedUsers.find( x => x.id === userId)) {
                throw new UnauthorizedException();
            }
        }

        return this.transform.toReturnWhiteboardDto(whiteboard)
    }
    async getAllInvitedUsers(id: string, userId: string): Promise<ReturnUserDTO[]> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: id, isDeleted: false},
            relations: ['author', 'invitedUsers']
        })

        if(!whiteboard) {
            throw new NotFoundException();
        }
        if (!whiteboard.invitedUsers.length) {
            throw new NotFoundException('Not invited users in this board')
        }
        if (whiteboard.author.id !== userId) {
            throw new UnauthorizedException()
        }

        return whiteboard.invitedUsers
    }
    async getAll(userId: string): Promise<SimpleReturnWhiteboardDTO[]> {

        const user = await this.usersRepo.findOne({
            where: { id: userId, isDeleted: false},
            relations: ['whiteboards', 'whiteboards.author', 'canUpdate', 'canUpdate.author']
        });

        const whiteboard = await this.whiteboardsRepo.find({
            where: { isPublic: true, isDeleted: false},
            relations: ['lines', 'circles', 'rectangles', 'author', 'textBoxes']
        });

        if(!user) {
            throw new NotFoundException();
        }

        const result = [...user.whiteboards, ...user.canUpdate].reduce((acc, value) => { return value.isPublic === false && value.isDeleted === false ? [...acc, value] : acc }, []);


        return [...result, ...whiteboard].map( x => ({
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

        const isExistWhiteboard = await this.whiteboardsRepo.findOne({
            where: { name: name }
        });

        if(isExistWhiteboard) {
            throw new HttpException(`Board with name: ${name} already exist`, 404);
        }

        const whiteboard: Whiteboard = await this.whiteboardsRepo.save({
            isPublic,
            name
        })
        user.whiteboards.push(whiteboard)
        await this.usersRepo.save(user);

        return this.transform.toReturnCreatedWhiteboardDto(whiteboard, user)
    }
    async delete(id: string): Promise<void> {
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: id, isDeleted: false},
        })
        if(!whiteboard) {
            throw new NotFoundException();
        }

        whiteboard.isDeleted = true;
        await this.whiteboardsRepo.save(whiteboard)
    }
    async update(id: string, body: UpdateWhiteboardDTO, whiteboardId: string): Promise<SimpleReturnWhiteboardDTO> {
        console.log(id, body);

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
        // if (body.invitedUsersId) {
        //     const invitedUser = await this.usersRepo.findOne({
        //         where: { id: body.invitedUsersId, isDeleted: false}
        //     });
        //     whiteboard.invitedUsers.push(invitedUser);
        // }

        body?.name ? whiteboard.name = body.name : null;   // fix update obj
        body?.isPublic ? whiteboard.isPublic = body.isPublic : null;
        console.log(whiteboard);

        return this.transform.toSimpleReturnWhiteboardDto(await this.whiteboardsRepo.save(whiteboard), whiteboard.author)
    }

    public async inviteToBoard(invitedUserName: string, invitesUsername: string, whiteboardId: string): Promise<void> {
        const invitedUser = await this.usersRepo.findOne({
          where: { userName: invitedUserName, isDeleted: false }
        });
        const invitesUser = await this.usersRepo.findOne({
          where: { userName: invitesUsername, isDeleted: false }
        });
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false },
            relations: ['invitedUsers', 'author']
        })

        if (whiteboard.author.id !== invitedUser.id) {
            throw new UnauthorizedException()
        }
        if (whiteboard.invitedUsers.some( x => x.id === invitesUser.id)) {
            throw new HttpException("Already invite in this whiteboard", 400)
        }
        whiteboard.invitedUsers.push(invitesUser);
        await this.whiteboardsRepo.save(whiteboard);
      }
    public async KickFromBoard(kickedUserName: string, kicksUserName: string, whiteboardId: string): Promise<void> {
        const kickedUser = await this.usersRepo.findOne({
          where: { userName: kickedUserName, isDeleted: false }
        });
        const kicksUser = await this.usersRepo.findOne({
          where: { userName: kicksUserName, isDeleted: false }
        });
        const whiteboard = await this.whiteboardsRepo.findOne({
            where: { id: whiteboardId, isDeleted: false },
            relations: ['invitedUsers', 'author']
        })

        if (whiteboard.author.id !== kicksUser.id) {
            throw new UnauthorizedException()
        }
        if (!whiteboard.invitedUsers.some( x => x.id === kickedUser.id)) {
            throw new HttpException(`User: ${kickedUser.userName} not invited`, 400)
        }

        const result = whiteboard.invitedUsers.filter( x => x.id !== kickedUser.id);
        whiteboard.invitedUsers = result;
        await this.whiteboardsRepo.save(whiteboard)
      }

}
