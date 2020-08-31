import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'src/models/payload/jwt-payload';
import * as bcrypt from 'bcrypt'
import { LoginUserDTO } from 'src/models/users/login.user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  async findUserByEmail(email: string): Promise<User> {

    return await this.userRepository.findOne({
      where: {
        email,
        isDeleted: false,
      },
     })
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const isUserValidated = await bcrypt.compare(password, user.password);
    return isUserValidated
            ? user
            : null;
  }

  async login(loginUser: LoginUserDTO): Promise<{ token: string }> {
    const user = await this.validateUser(loginUser.email, loginUser.password);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials!');
    }

    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      avatarURL: user.avatarURL,
    };

    const token = await this.jwtService.signAsync(payload);

    user.token = token;

    await this.userRepository.save(user);

    return {
      token,
    };
  }

  async logout(token: string): Promise<string> {

    const user = await this.userRepository.findOne({
      where: { token }
    });

    user.token = null;
    this.userRepository.save(user);
    return 'User is logged out'
  }

}
