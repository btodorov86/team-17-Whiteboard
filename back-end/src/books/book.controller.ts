import { Controller, Get, Param, Post, Body, Delete, Put, Patch, Query, UseGuards, ValidationPipe, Req, UseInterceptors, UploadedFile } from "@nestjs/common";
import { ReturnBookDTO } from "src/models/books/return.book.dto";
import { CreateBookDTO } from "src/models/books/create.book.dto";
import { BooksService } from 'src/core/services/books/books.service';
import { UpdateBookDTO } from 'src/models/books/update.book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/core/enum/user-role.enum';
import { Request } from 'express';
import { User } from 'src/models/users/user.entity';
import { IsBanGuard } from 'src/auth/ban.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('books')
export class BooksController {
    constructor(
        private readonly bookService: BooksService
    ) { }

    @Get()
    public async all(
        @Query('header') header: string,
        @Query('author') author: string,
        ): Promise<Partial<ReturnBookDTO>[]> {
            if (header || author) {

                return await this.bookService.allByQuery(header, author);
            }

        return await this.bookService.all()
    }

    @UseGuards(AuthGuard('jwt'), IsBanGuard)
    @Get(':id')
    public async getById(@Param('id') id: string): Promise<Partial<ReturnBookDTO>> {

        return await this.bookService.getOne(id)
    }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin))
    @Post()
    public async create(@Body(new ValidationPipe({ whitelist: true })) body: CreateBookDTO): Promise<Partial<ReturnBookDTO>> {
        return await this.bookService.create(body)
    }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin))
    @Delete(':id')
    public async delete(@Param('id') id: string): Promise<string> {
        return await this.bookService.delete(id)
    }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin), IsBanGuard)
    @Put(':id')
    public async update(
        @Param('id') id: string,
        @Body(new ValidationPipe({ whitelist: true })) body: Partial<UpdateBookDTO>, ): Promise<Partial<ReturnBookDTO>> {
        return await this.bookService.update(id, body)
    }

    @UseGuards(AuthGuard('jwt'), IsBanGuard, new RolesGuard(UserRole.Admin))
    @Put(':id/upload')
    @UseInterceptors(FileInterceptor('files', {
        storage: diskStorage({
          destination: './covers',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }))
    public async uploadCover(
        @Param('id') id: string,
        @UploadedFile() files,
        ): Promise<Partial<ReturnBookDTO>> {
            return await this.bookService.uploadCover(id, files.filename)
    }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin))
    @Patch(':id')
    public async unDelete(@Param('id') id: string,): Promise<string> {
        return await this.bookService.unDelete(id);
    }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.User))
    @Put(':bookId/borrow')
    public async borrowBook(
        @Param('bookId') bookId: string,
        // @Param('userId') userId: string,
        @Req() req: Request,
    ): Promise<string> {
        const user = req.user as User;
        return await this.bookService.borrow(user.id, bookId);
    }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.User))
    @Put(':bookId/return')
    public async returnBook(
        @Param('bookId') bookId: string,
        @Req() req: Request,
    ): Promise<string> {
        const user = req.user as User;
        return await this.bookService.returnBook(user.id, bookId);
    }

}
