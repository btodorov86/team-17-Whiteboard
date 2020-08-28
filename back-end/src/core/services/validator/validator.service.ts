import { Injectable, BadRequestException } from '@nestjs/common';
import { RatingValue } from 'src/core/enum/rating.enum';
import { UserRole } from 'src/core/enum/user-role.enum';
import { ReactionValue } from 'src/core/enum/reaction.enum';

@Injectable()
export class ValidatorService {
    public string(value: string, minLength?: number, maxLength?: number, property?: string, msg?: string): void {
        if (!value) {
            throw new BadRequestException(msg ?? `Undefined, null or empty string not valid ${property}`)
        }
        if (value.length < minLength) {
            throw new BadRequestException(msg ?? `Min ${property} length must be ${minLength}`)
        }
        if (value.length > maxLength) {
            throw new BadRequestException(msg ?? `Max ${property} length must be ${maxLength}`)
        }
    }
    public password(value: string, msg?: string): void {
        this.string(value, 4, 10, 'password', msg);
        if (!value.match(/[A-Z]/g)) {
            throw new BadRequestException(msg ?? `Password must contain one or more capital letters`)
        }
        if (!value.match(/[0-9]/g)) {
            throw new BadRequestException(msg ?? `Password must contain one or more numbers`)
        }

    }
    public checkRatingValue(value: string | number, msg?: string): void {
        if (!Number(value)) {
            throw new BadRequestException('Invalid reactionValue input, input must be between 1 and 2')
        }
        if (!Object.values(RatingValue).includes(RatingValue[value])) {
            throw new BadRequestException(msg ?? `Invalid input value, rating can be between 1 and 5 `);
        }
    }
    public checkRoleValue(value: string | number, msg?: string): void {
        if (!Number(value)) {
            throw new BadRequestException('Invalid reactionValue input, input must be between 1 and 2')
        }
        if (!Object.values(UserRole).includes(value)) {
            throw new BadRequestException(msg ?? `Invalid input value, userType can be user or admin`);
        }
    }
    public checkReactionValue(value: string | number, msg?: string): void {
        if (!Number(value)) {
            throw new BadRequestException('Invalid reactionValue input, input must be between 1 and 2')
        }
        if (!Object.values(ReactionValue).includes(value)) {
            throw new BadRequestException(msg ?? `Invalid input value, Reaction can be like or dislike`);
        }
    }

}
