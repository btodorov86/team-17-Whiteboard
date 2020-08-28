import { CoreModule } from "src/core/core.module";
import { UsersController } from "./user.controller";
import { Module } from "@nestjs/common";

@Module({
    imports: [CoreModule],
    controllers: [UsersController],
  })
  export class UsersModule {}
