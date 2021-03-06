import { Controller, Get, Post, Body, Delete, Param, Put, Patch, BadRequestException, ValidationPipe, UseGuards, Req, UseInterceptors, UploadedFile, NotFoundException } from "@nestjs/common";
import { ReturnUserDTO as ReturnUserDTO } from "src/models/users/return.user.dto";
import { CreateUserDTO } from "src/models/users/create.user.dto";
import { User } from 'src/models/users/user.entity';
import { UsersService } from 'src/core/services/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateUserDTO } from 'src/models/users/update.user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {

    constructor(
        private readonly userService: UsersService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    public async all(): Promise<Partial<ReturnUserDTO>[]> {
        return await this.userService.all()
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    public async getById(@Param('id') id: string): Promise<Partial<ReturnUserDTO>> {
        try {
            return await this.userService.getOne(id)

        } catch (error) {
            throw new NotFoundException(`User with id: ${id} does not exist`)
        }
    }

    //@UseGuards(AuthGuard('jwt'))
    @Post()
    public async create(@Body(new ValidationPipe({ whitelist: true })) body: CreateUserDTO): Promise<Partial<ReturnUserDTO>> {
        try {
            return await this.userService.create(body)
        } catch (error) {
            throw new BadRequestException(error.message)
        }

    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    public async delete(@Param('id') id: string): Promise<string> {
        return await this.userService.delete(id)
    }

    // @UseGuards(AuthGuard('jwt'))
    // @Patch(':id')
    // public async undelete(@Param('id') id: string): Promise<string> {
    //     return await this.userService.unDelete(id)
    // }

    @UseGuards(AuthGuard('jwt'))
    @Put()
    public async update(
        @Body(new ValidationPipe({whitelist: true})) body: UpdateUserDTO,
        @Req() req: Request,): Promise<ReturnUserDTO> {
        const user = req.user as User;
        return this.userService.update(user.id, body.currentPassword, body.newPassword)
        // validate name and password
        // delete every not needed property from input obj
        // return await this.userService.update(id, body, user.id)
    }

    // @UseGuards(AuthGuard('jwt'))
    @Post('/:id/avatar')
    @UseInterceptors(FileInterceptor('files', {
        storage: diskStorage({
          destination: './avatars',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }))
    async uploadFile(
        @UploadedFile() files,
        @Param('id') userId: string,
        @Req() req: Request,
        ): Promise<any> {
            const user = req.user as User;

            return this.userService.upload(userId, files.filename)

    }
}
