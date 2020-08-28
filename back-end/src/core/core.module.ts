import { Module } from "@nestjs/common";
import { BooksService } from "./services/books/books.service";
import { UsersService } from "./services/users/users.service";
import { ReviewsService } from "./services/reviews/reviews.service";
import { TransformService } from './services/transform/transform.service';
import { ValidatorService } from './services/validator/validator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/users/user.entity';
import { Book } from 'src/models/books/books.entity';
import { Review } from 'src/models/reviews/review.entity';
import { Rating } from 'src/models/rating/rating.entity';
import { RatingService } from './services/rating/rating.service';
import { Reaction } from 'src/models/reaction/reaction.entity';
import { ReactionService } from './services/reactions/reaction.service';
import { IsBannedService } from './services/isBanned/isBanned.service';
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'src/constants/secret';
import { JwtStrategy } from './services/strategy/jwt-strategy';
import { AuthService } from './services/auth/auth.service';
import { IsBanned } from 'src/models/isBanned/isBanned.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { UserLevelService } from './services/level/user-level.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Book, Review, Rating, Reaction, IsBanned]),
        ScheduleModule.forRoot(),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '3d',
            }
        }),
    ],
    providers:[
        BooksService, 
        UsersService, 
        ReviewsService,
        RatingService, 
        TransformService, 
        ValidatorService,
        ReactionService,
        IsBannedService,
        AuthService,
        JwtStrategy,
        UserLevelService,
    ], 
    exports:[
        BooksService, 
        UsersService, 
        ReviewsService,
        RatingService, 
        TransformService, 
        ValidatorService,
        ReactionService,
        IsBannedService,
        AuthService,
        TypeOrmModule.forFeature([IsBanned]),
    ],
})
export class CoreModule{}

