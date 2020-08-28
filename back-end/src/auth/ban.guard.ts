import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/models/users/user.entity';
import { Request } from 'express'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsBanned } from 'src/models/isBanned/isBanned.entity';


@Injectable()
export class IsBanGuard implements CanActivate {

    constructor(
        
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
        @InjectRepository(IsBanned)
        private readonly isBannedRepo: Repository<IsBanned>,

    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as User;

        if (Boolean(user.isBanned)) {
            const user1 = await this.usersRepo.findOne({
                where: { id: user.id, isDeleted: false },
                relations: ["isBanned"]
            });

            if (user1.isBanned.expirationDate < new Date() ) {
                await this.unBan(user1);
                return true
            }

            return false
        }

        return true
        // return Boolean(!user.isBanned)
    }

    private async unBan(user: User): Promise<void> {
        
        const isBannedId = user.isBanned.id;
        user.isBanned = null;
        user = await this.usersRepo.save(user)
        await this.isBannedRepo.delete(isBannedId);

    }
}
