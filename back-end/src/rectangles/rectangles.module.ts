import { Module } from "@nestjs/common";
import { CoreModule } from "src/core/core.module";
import { RectangleController } from './rectangles.controller';

@Module({
    imports: [CoreModule],
    controllers: [RectangleController],
  })
  export class RectangleModule {}
