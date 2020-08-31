import { Controller, Get, Post, Body, Delete, Param, Put, Patch, BadRequestException, ValidationPipe, UseGuards, Req, UseInterceptors, UploadedFile, NotFoundException } from "@nestjs/common";
import { ReturnUserDTO as ReturnUserDTO } from "src/models/users/return.user.dto";
import { CreateUserDTO } from "src/models/users/create.user.dto";
import { User } from 'src/models/users/user.entity';
import { UsersService } from 'src/core/services/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/core/services/whiteBoard/node_modules/src/core/enum/user-role.enum';
import { Request } from 'express';
import { IsBanGuard } from 'src/auth/ban.guard';
import { UpdateUserDTO } from 'src/models/users/update.user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {

    constructor(
        private readonly userService: UsersService,
    ) { }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin), IsBanGuard)
    @Get()
    public async all(): Promise<Partial<ReturnUserDTO>[]> {
        return await this.userService.all()
    }

    @UseGuards(AuthGuard('jwt'), IsBanGuard)
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

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin), IsBanGuard)
    @Delete(':id')
    public async delete(@Param('id') id: string): Promise<string> {
        return await this.userService.delete(id)
    }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin), IsBanGuard)
    @Patch(':id')
    public async undelete(@Param('id') id: string): Promise<string> {
        return await this.userService.unDelete(id)
    }

    @UseGuards(AuthGuard('jwt'), IsBanGuard)
    @Put(':id')
    public async update(
        @Body(new ValidationPipe({ whitelist: true })) body: Partial<UpdateUserDTO>,
        @Param('id') id: string,
        @Req() req: Request,): Promise<Partial<ReturnUserDTO>> {
        const user = req.user as User;
        // validate name and password
        // delete every not needed property from input obj
        return await this.userService.update(id, body, user.id)
    }

    @UseGuards(AuthGuard('jwt'), IsBanGuard)
    @Post('upload')
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
        @Req() req: Request,
        ): Promise<Partial<ReturnUserDTO>> {
            const user = req.user as User;

            return this.userService.upload(user.id, files.filename)

    }

    // @Patch(':id/ban/:userId')
    // public async ban(
    //     @Param('id') id: string,
    //     @Param('userId') userId: string ): Promise<string> {

    //     return await this.userService.ban(userId);
    // }
    // @Patch(':id/unban/:userId')
    // public async unban(
    //     @Param('id') id: string,
    //     @Param('userId') userId: string ): Promise<string> {

    //     return await this.userService.unban(userId);
    // }

}
