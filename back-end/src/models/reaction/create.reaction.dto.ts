import { ReactionValue } from 'src/core/enum/reaction.enum';
import { /*IsEnum,*/ IsNotEmpty } from 'class-validator';

export class CreateReactionDTO {
    // @IsEnum(ReactionValue)
    @IsNotEmpty()
    reactionValue: ReactionValue
}
