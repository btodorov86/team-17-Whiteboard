import { Controller, Post, Body, Param, Put, Delete, ValidationPipe, UseGuards, Req, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RectangleService } from 'src/core/services/rectangle/rectangle.service';
import { CreateRectangleDTO } from 'src/models/rectangle/create.rectangle.dto';
import { ReturnRectangleDTO } from 'src/models/rectangle/return.rectangle.dto';
import { Request } from 'express';
import { User } from 'src/models/users/user.entity';


@Controller('whiteboards/:id/rectangles')

export class RectangleController {

    constructor(
        private readonly rectangleService: RectangleService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(
        @Body(new ValidationPipe({whitelist: true})) body: CreateRectangleDTO,
        @Req() req: Request,
        @Param('id') id: string
        ): Promise<ReturnRectangleDTO> {
        const user = req.user as User;
        return await this.rectangleService.create(id, body, user.id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':rectangleId')
    async update(
        @Param('id') id: string,
        @Req() req: Request,
        @Body(new ValidationPipe({whitelist: true})) body: CreateRectangleDTO,
        @Param('rectangleId') rectangleId: string,
        ): Promise<ReturnRectangleDTO> {
            const user = req.user as User;
        return await this.rectangleService.update(id, body, rectangleId, user.id)
    }

    @Delete(':rectangleId')
    async delete(
        @Param('rectangleId') rectangleId: string,
        ): Promise<string> {
        return this.rectangleService.delete(rectangleId)
    }
    @Patch(':rectangleId')
    async recover(
        @Param('rectangleId') rectangleId: string,
        ): Promise<string> {
        return this.rectangleService.recover(rectangleId)
    }

}
