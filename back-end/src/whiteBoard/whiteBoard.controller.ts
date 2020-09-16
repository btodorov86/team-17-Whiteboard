import { Controller, Get, Param, UseGuards, Req, ValidationPipe, Body, Post, Delete, Put } from '@nestjs/common';
import { WhiteBoardService } from 'src/core/services/whiteBoard/whiteBoard.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateWhiteboardDTO } from 'src/models/whiteboard/create.whiteboard.dto';
import { User } from 'src/models/users/user.entity';
import { ReturnWhiteboardDTO } from 'src/models/whiteboard/return.whiteboard.dto';
import { Request } from 'express';
import { ReturnCreatedWhiteboardDTO } from 'src/models/whiteboard/return.created.whiteboard.dto';
import { SimpleReturnWhiteboardDTO } from 'src/models/whiteboard/simple.return.whiteboard.dto';
import { UpdateWhiteboardDTO } from 'src/models/whiteboard/update.whiteboard.dto';


@Controller('whiteboards')

export class WhiteBoardController {

    constructor (
        private readonly whiteboardService: WhiteBoardService
    ) {}

    @Get('public')
    async getAllPublic(): Promise<ReturnWhiteboardDTO[]> {

        return await this.whiteboardService.getAllPublic()
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('private')
    async getAllPrivate(
        @Req() req: Request,
    ): Promise<SimpleReturnWhiteboardDTO[]> {
         const user = req.user as User;
        return await this.whiteboardService.getAllPrivate(user.id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getOne(
        @Param('id') id: string,
        // @Req() req: Request,
        ): Promise<ReturnWhiteboardDTO> {
            // const user = req.user as User;
        return await this.whiteboardService.getOne(id)
    }
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(
        @Req() req: Request,
        @Body(new ValidationPipe({ whitelist: true })) body: CreateWhiteboardDTO
        ): Promise<ReturnCreatedWhiteboardDTO> {
            const user = req.user as User;
        return await this.whiteboardService.create(body.name, body.isPublic, user.id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @Req() req: Request,
        ): Promise<string> {
            const user = req.user as User;
        return await this.whiteboardService.delete(id, user.id)
    }

    @UseGuards(AuthGuard('jwt')) // For test !!!!!!!!!!!!!!
    @Put(':id')
    async update(
        @Req() req: Request,
        @Param('id') whiteboardId: string,
        @Body(new ValidationPipe({ whitelist: true })) body: UpdateWhiteboardDTO
        ): Promise<SimpleReturnWhiteboardDTO> {
            const user = req.user as User;
        return await this.whiteboardService.update(user.id, body, whiteboardId)
    }


}
