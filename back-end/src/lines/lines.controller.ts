import { Controller, Post, Body, Param, Put, Delete, ValidationPipe } from '@nestjs/common';
import { CreateLineDTO } from 'src/models/line/create.line.dto';
import { ReturnLineDTO } from 'src/models/line/return.line.dto';
import { LineService } from 'src/core/services/line/line.service';

@Controller('whiteboards/:id/lines')

export class LinesController {

    constructor(
        private readonly lineService: LineService
    ) {}


    @Post()
    async create(
        @Body(new ValidationPipe({whitelist: true})) body: CreateLineDTO,
        @Param('id') id: string
        ): Promise<ReturnLineDTO> {
            console.log('11111');

        return await this.lineService.create(id, body)
    }

    @Put(':lineId')
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe({whitelist: true})) body: Partial<CreateLineDTO>,
        @Param('lineId') lineId: string,
        ): Promise<ReturnLineDTO> {
        return await this.lineService.update(id, body, lineId)
    }

    @Delete(':lineId')
    async delete(
        @Param('lineId') lineId: string,
        ): Promise<string> {
        return this.lineService.delete(lineId)
    }

}
