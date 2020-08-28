import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsBanned } from 'src/models/isBanned/isBanned.entity';
import { Repository } from 'typeorm';
import { User } from 'src/models/users/user.entity';
import { ReturnIsBannedDTO } from 'src/models/isBanned/return.isBanned.dto';
import { ReturnUserDTO } from 'src/models/users/return.user.dto';
import { TransformService } from '../transform/transform.service';

@Injectable()
export class IsBannedService {
    constructor(
        @InjectRepository(IsBanned)
        private readonly isBannedRepo: Repository<IsBanned>,
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
        private readonly transform: TransformService,

    ) { }
    public async ban(id: string, description?: string): Promise<Partial<ReturnIsBannedDTO>> {
        const user = await this.usersRepo.findOne({
            where: { id: id, isDeleted: false },
            relations: ["isBanned"],
        });

        if (!user || user.isBanned) {
            throw new NotFoundException('User does not exist or is already banned')
        }
        if (!user.isBanned) {
            const ban = new IsBanned();
            ban.description = description || `User with id: ${id} is banned `,
                ban.expirationDate = new Date();
            ban.expirationDate.setDate(ban.expirationDate.getDate() + 30);
            await this.isBannedRepo.save(ban)

            user.isBanned = ban;

            return this.transform.toReturnUserDto(await this.usersRepo.save(user), true);
        }

        return user.isBanned
    }

    public async unban(userId: string): Promise<Partial<ReturnUserDTO>> {
        let user = await this.usersRepo.findOne({
            where: { id: userId, isDeleted: false },
            relations: ["isBanned"]
        });
        if (!user || !user.isBanned) {
            throw new NotFoundException('User does not exist or was not banned')
        }
        const isBannedId = user.isBanned.id;
        user.isBanned = null;
        user = await this.usersRepo.save(user)
        await this.isBannedRepo.delete(isBannedId);

        return this.transform.toReturnUserDto(user, true);
    }


}
