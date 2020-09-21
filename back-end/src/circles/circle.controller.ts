import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
  Patch
} from '@nestjs/common';
import { CreateCircleDTO } from 'src/models/circle/create.circle.dto';
import { ReturnCircleDTO } from 'src/models/circle/return.circle.dto';
import { CircleService } from 'src/core/services/circle/circle.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/models/users/user.entity';
import { Request } from 'express';

@Controller('whiteboards/:id/circles')
export class CircleController {
  constructor(private readonly circleService: CircleService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true })) body: CreateCircleDTO,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<ReturnCircleDTO> {
    const user = req.user as User;

    return await this.circleService.create(id, body, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':circleId')
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: true })) body: CreateCircleDTO,
    @Param('circleId') circleId: string,
  ): Promise<ReturnCircleDTO> {
    const user = req.user as User;
    return await this.circleService.update(id, body, circleId, user.id);
  }

  @Delete(':circleId')
    async delete(
        @Param('circleId') circleId: string,
        ): Promise<ReturnCircleDTO> {
        return this.circleService.delete(circleId)
    }
    @Patch(':circleId')
    async recover(
        @Param('circleId') circleId: string,
        ): Promise<ReturnCircleDTO> {

        return this.circleService.recover(circleId)
    }
}
