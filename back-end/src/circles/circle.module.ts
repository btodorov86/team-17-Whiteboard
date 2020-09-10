import { Module } from "@nestjs/common";
import { CoreModule } from "src/core/core.module";
import { CircleController } from './circle.controller';

@Module({
    imports: [CoreModule],
    controllers: [CircleController],
  })
  export class CircleModule {}
