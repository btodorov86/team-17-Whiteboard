import { Module } from "@nestjs/common";
import { CoreModule } from "src/core/core.module";
import { CommentsController } from './coments.controller';

@Module({
    imports: [CoreModule],
    controllers: [CommentsController],
  })
  export class CommentModule {}
