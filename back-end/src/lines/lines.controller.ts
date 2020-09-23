import { Controller, Post, Body, Param, Put, Delete, ValidationPipe, UseGuards, Req, Patch } from '@nestjs/common';
import { CreateLineDTO } from 'src/models/line/create.line.dto';
import { ReturnLineDTO } from 'src/models/line/return.line.dto';
import { LineService } from 'src/core/services/line/line.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'src/models/users/user.entity';


@Controller('whiteboards/:id/lines')

export class LinesController {

    constructor(
        private readonly lineService: LineService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(
        @Body(new ValidationPipe({whitelist: true})) body: CreateLineDTO,
        @Req() req: Request,
        @Param('id') id: string
        ): Promise<ReturnLineDTO> {
            const user = req.user as User;
        return await this.lineService.create(id, body, user.id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':lineId')
    async update(
        @Param('id') id: string,
        @Req() req: Request,
        @Body(new ValidationPipe({whitelist: true})) body: Partial<CreateLineDTO>,
        @Param('lineId') lineId: string,
        ): Promise<ReturnLineDTO> {
            const user = req.user as User;
        return await this.lineService.update(id, body, lineId, user.id)
    }

    @Delete(':lineId')
    async delete(
        @Param('lineId') lineId: string,
        ): Promise<ReturnLineDTO> {
        return this.lineService.delete(lineId)
    }
    @Patch(':lineId')
    async recover(
        @Param('lineId') lineId: string,
        ): Promise<ReturnLineDTO> {

        return this.lineService.recover(lineId)
    }

}
