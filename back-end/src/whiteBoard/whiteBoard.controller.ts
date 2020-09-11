import { Controller, Get, Param, UseGuards, Req, ValidationPipe, Body, Post, Delete } from '@nestjs/common';
import { WhiteBoardService } from 'src/core/services/whiteBoard/whiteBoard.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateWhiteboardDTO } from 'src/models/whiteboard/create.whiteboard.dto';
import { User } from 'src/models/users/user.entity';
import { ReturnWhiteboardDTO } from 'src/models/whiteboard/return.whiteboard.dto';
import { Request } from 'express';
import { ReturnCreatedWhiteboardDTO } from 'src/models/whiteboard/return.created.whiteboard.dto';


@Controller('whiteboards')

export class WhiteBoardController {

    constructor (
        private readonly WhiteboardService: WhiteBoardService
    ) {}

    @Get('public')
    async getAllPublic(): Promise<ReturnWhiteboardDTO[]> {

        return await this.WhiteboardService.getAllPublic()
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getOne(
        @Param('id') id: string,
        // @Req() req: Request,
        ): Promise<ReturnWhiteboardDTO> {
            // const user = req.user as User;
        return await this.WhiteboardService.getOne(id)
    }
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(
        @Req() req: Request,
        @Body(new ValidationPipe({ whitelist: true })) body: CreateWhiteboardDTO
        ): Promise<ReturnCreatedWhiteboardDTO> {
            const user = req.user as User;
        return await this.WhiteboardService.create(body.name, body.isPublic, user.id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @Req() req: Request,
        ): Promise<string> {
            const user = req.user as User;
        return await this.WhiteboardService.delete(id, user.id)
    }


}
