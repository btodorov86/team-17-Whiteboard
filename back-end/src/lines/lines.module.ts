import { Module } from "@nestjs/common";
import { CoreModule } from "src/core/core.module";
import { LinesController } from './lines.controller';

@Module({
    imports: [CoreModule],
    controllers: [LinesController],
  })
  export class LineModule {}
