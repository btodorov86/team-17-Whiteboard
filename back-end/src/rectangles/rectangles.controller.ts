import { Controller, Post, Body, Param, Put, Delete, ValidationPipe } from '@nestjs/common';
import { RectangleService } from 'src/core/services/rectangle/rectangle.service';
import { CreateRectangleDTO } from 'src/models/rectangle/create.rectangle.dto';
import { ReturnRectangleDTO } from 'src/models/rectangle/return.rectangle.dto';

@Controller('whiteboards/:id/rectangles')

export class RectangleController {

    constructor(
        private readonly rectangleService: RectangleService
    ) {}


    @Post()
    async create(
        @Body(new ValidationPipe({whitelist: true})) body: CreateRectangleDTO,
        @Param('id') id: string
        ): Promise<ReturnRectangleDTO> {

        return await this.rectangleService.create(id, body)
    }

    @Put(':rectangleId')
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe({whitelist: true})) body: CreateRectangleDTO,
        @Param('rectangleId') rectangleId: string,
        ): Promise<ReturnRectangleDTO> {
        return await this.rectangleService.update(id, body, rectangleId)
    }

    @Delete(':rectangleId')
    async delete(
        @Param('rectangleId') rectangleId: string,
        ): Promise<string> {
        return this.rectangleService.delete(rectangleId)
    }

}
