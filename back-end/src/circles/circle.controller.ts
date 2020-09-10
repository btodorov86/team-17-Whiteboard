import { Controller, Post, Body, Param, Put, Delete, ValidationPipe } from '@nestjs/common';
import { CreateCircleDTO } from 'src/models/circle/create.circle.dto';
import { ReturnCircleDTO } from 'src/models/circle/return.circle.dto';
import { CircleService } from 'src/core/services/circle/circle.service';

@Controller('whiteboards/:id/circles')

export class CircleController {

    constructor(
        private readonly circleService: CircleService
    ) {}


    @Post()
    async create(
        @Body(new ValidationPipe({whitelist: true})) body: CreateCircleDTO,
        @Param('id') id: string
        ): Promise<ReturnCircleDTO> {

        return await this.circleService.create(id, body)
    }

    @Put(':circleId')
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe({whitelist: true})) body: CreateCircleDTO,
        @Param('circleId') circleId: string,
        ): Promise<ReturnCircleDTO> {
        return await this.circleService.update(id, body, circleId)
    }

    @Delete(':circleId')
    async delete(
        @Param('circleId') circleId: string,
        ): Promise<string> {
        return this.circleService.delete(circleId)
    }

}
