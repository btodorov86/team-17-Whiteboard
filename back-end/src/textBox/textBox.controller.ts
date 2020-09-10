import { Controller, Post, Body, Param, Put, Delete, ValidationPipe } from '@nestjs/common';
import { TextBoxService } from 'src/core/services/textBox/textBox.service';
import { CreateTextBoxDTO } from 'src/models/textBox/create.textBox.dto';
import { ReturnTextBoxDTO } from 'src/models/textBox/return.textBox.dto';

@Controller('whiteboards/:id/texts')

export class TextBoxController {

    constructor(
        private readonly textBoxService: TextBoxService
    ) {}


    @Post()
    async create(
        @Body(new ValidationPipe({whitelist: true})) body: CreateTextBoxDTO,
        @Param('id') id: string
        ): Promise<ReturnTextBoxDTO> {

        return await this.textBoxService.create(id, body)
    }

    @Put(':textBoxId')
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe({whitelist: true})) body: CreateTextBoxDTO,
        @Param('textBoxId') textBoxId: string,
        ): Promise<ReturnTextBoxDTO> {
        return await this.textBoxService.update(id, body, textBoxId)
    }

    @Delete(':textBoxId')
    async delete(
        @Param('textBoxId') textBoxId: string,
        ): Promise<string> {
        return this.textBoxService.delete(textBoxId)
    }

}
