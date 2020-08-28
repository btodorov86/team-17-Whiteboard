import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';
import { jwtConstants } from 'src/constants/secret';
import { JWTPayload } from 'src/models/payload/jwt-payload';
import { User } from 'src/models/users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JWTPayload): Promise<User> {

    // the returned user is injected into Request
    return await this.authService.findUserByEmail(payload.email);
  }
}
