import { Controller, Post, Body, Param, Put, Delete, ValidationPipe, UseGuards, Req, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TextBoxService } from 'src/core/services/textBox/textBox.service';
import { CreateTextBoxDTO } from 'src/models/textBox/create.textBox.dto';
import { ReturnTextBoxDTO } from 'src/models/textBox/return.textBox.dto';
import { Request } from 'express';
import { User } from 'src/models/users/user.entity';
import { use } from 'passport';


@Controller('whiteboards/:id/textBoxes')

export class TextBoxController {

    constructor(
        private readonly textBoxService: TextBoxService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(
        @Body(new ValidationPipe({whitelist: true})) body: CreateTextBoxDTO,
        @Req() req: Request,
        @Param('id') id: string
        ): Promise<ReturnTextBoxDTO> {
            const user = req.user as User;
        return await this.textBoxService.create(id, body, user.id)
    }
    @UseGuards(AuthGuard('jwt'))
    @Put(':textBoxId')
    async update(
        @Param('id') id: string,
        @Req() req: Request,
        @Body(new ValidationPipe({whitelist: true})) body: CreateTextBoxDTO,
        @Param('textBoxId') textBoxId: string,
        ): Promise<ReturnTextBoxDTO> {
            const user = req.user as User;
        return await this.textBoxService.update(id, body, textBoxId, user.id)
    }

    @Delete(':textBoxId')
    async delete(
        @Param('textBoxId') textBoxId: string,
        ): Promise<ReturnTextBoxDTO> {
        return this.textBoxService.delete(textBoxId)
    }
    @Patch(':textBoxId')
    async recover(
        @Param('textBoxId') textBoxId: string,
        ): Promise<ReturnTextBoxDTO> {

        return this.textBoxService.recover(textBoxId)
    }

}
