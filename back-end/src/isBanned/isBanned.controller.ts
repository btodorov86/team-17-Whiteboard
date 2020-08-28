import { Controller, Post, Param, Put, UseGuards } from '@nestjs/common';
import { IsBannedService } from 'src/core/services/isBanned/isBanned.service';
import { ReturnIsBannedDTO } from 'src/models/isBanned/return.isBanned.dto';
import { ReturnUserDTO } from 'src/models/users/return.user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/core/enum/user-role.enum';

@Controller('ban')
export class IsBannedController {
    constructor(
        private readonly isBannedService: IsBannedService
    ) { }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin))
    @Post('users/:id')
    async ban(@Param('id') id: string): Promise<Partial<ReturnIsBannedDTO>> {
        return await this.isBannedService.ban(id)
    }

    @UseGuards(AuthGuard('jwt'), new RolesGuard(UserRole.Admin))
    @Put('users/:id')
    async unBan(@Param('id') id: string): Promise<Partial<ReturnUserDTO>> {
        return await this.isBannedService.unban(id)
    }
}
