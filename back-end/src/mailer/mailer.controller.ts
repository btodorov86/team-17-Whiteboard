import { MailerService } from "@nestjs-modules/mailer";
import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { ResetPasswordEmailService } from "src/core/services/mailer/mailer.service";

@Controller('recover')
export class MailerController {

    constructor(
        private readonly resetPasswordEmailService: ResetPasswordEmailService,
    ) { }

    @Post()
    public async create(@Body() body: {email: string}): Promise<string> {
        console.log(body)
        return await this.resetPasswordEmailService.resetPassword(body.email)
    }
}