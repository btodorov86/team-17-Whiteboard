import { Controller, Post, Body, Req, Delete } from '@nestjs/common';
import { AuthService } from 'src/core/services/auth/auth.service';
import { Request } from 'express'
import { LoginUserDTO } from 'src/models/users/login.user.dto';

@Controller('session')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post()
  async login(@Body() user: LoginUserDTO): Promise<{ token: string }> {
    return await this.authService.login(user);
  }


  @Delete()
  async logout(
    @Req() req: Request,
  ): Promise<string> {
    const token = req.headers.authorization;

    return await this.authService.logout(token.slice(7));
  }

}
