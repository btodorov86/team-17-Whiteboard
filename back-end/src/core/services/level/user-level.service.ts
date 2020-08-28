import { Injectable } from '@nestjs/common';
import { ReadingPoints } from 'src/core/enum/reading-points.enum';
import { User } from 'src/models/users/user.entity';
import { UserLevel } from 'src/core/enum/user-level.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserLevelService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }
    
    async levelUp(user: User, points: ReadingPoints): Promise<string> {
        user.readPoints += points;
        const userPoints = user.readPoints + points
        if (userPoints >= 1 && userPoints < 3) {
            user.lvl = UserLevel.Silver
        } else if (userPoints >= 3) {
            user.lvl = UserLevel.Gold
        }

        await this.userRepo.save(user)

        return `User lvl: ${UserLevel[user.lvl]}`
    }
}
