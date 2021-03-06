import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/user.module';
import { AuthController } from './auth/auth.controller';
import { AppGatewayChat } from './core/services/gateway/app.gateway.chat';
import { WhiteBoardModule } from './whiteBoard/whiteBoard.module';
import { LineModule } from './lines/lines.module';
import { RectangleModule } from './rectangles/rectangles.module';
import { CircleModule } from './circles/circle.module';
import { TextBoxModule } from './textBox/textBox.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerController } from './mailer/mailer.controller';
import { CommentModule } from './comments/coments.module';



@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    WhiteBoardModule,
    LineModule,
    RectangleModule,
    CircleModule,
    CommentModule,
    TextBoxModule,
    MailerModule.forRoot({
      transport: 'smtp://alboig2005@gmail.com',
    }),
  ],
  controllers: [AuthController, MailerController],
  providers: [AppGatewayChat],
})
export class AppModule {}
