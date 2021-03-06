import { Module } from "@nestjs/common";
import { UsersService } from "./services/users/users.service";
import { TransformService } from './services/transform/transform.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/users/user.entity';
import { Whiteboard } from 'src/models/whiteboard/whiteboard.entity';
import { Circle } from 'src/models/circle/circle.entity';
import { CircleService } from './services/circle/circle.service';
import { Rectangle } from 'src/models/rectangle/rectangle.entity';
import { RectangleService } from './services/rectangle/rectangle.service';
import { LineService } from './services/line/line.service';
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'src/constants/secret';
import { JwtStrategy } from './services/strategy/jwt-strategy';
import { AuthService } from './services/auth/auth.service';
import { Line } from 'src/models/line/line.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { WhiteBoardService } from './services/whiteBoard/whiteBoard.service';
import { TextBoxService } from './services/textBox/textBox.service';
import { TextBox } from 'src/models/textBox/textBox.entity';
import { ResetPasswordEmailService } from "./services/mailer/mailer.service";
import { CommentService } from './services/comment/comment.service';
import { Comment } from 'src/models/comment/comment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Circle, Rectangle, Line, Whiteboard, TextBox, Comment]),
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
        UsersService,
        TransformService,
        AuthService,
        JwtStrategy,
        WhiteBoardService,
        CircleService,
        RectangleService,
        LineService,
        TextBoxService,
        ResetPasswordEmailService,
        CommentService,
    ],
    exports:[
        UsersService,
        TransformService,
        AuthService,
        JwtStrategy,
        WhiteBoardService,
        CircleService,
        RectangleService,
        LineService,
        TextBoxService,
        ResetPasswordEmailService,
        CommentService,
    ],
})
export class CoreModule{}
