import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/user.module';
import { AuthController } from './auth/auth.controller';
import { AppGateway } from './app.gateway';
import { WhiteBoardModule } from './whiteBoard/whiteBoard.module';



@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    WhiteBoardModule,
  ],
  controllers: [AuthController],
  providers: [AppGateway],
})
export class AppModule {}
