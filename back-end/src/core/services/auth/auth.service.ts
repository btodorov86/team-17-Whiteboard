import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'src/models/payload/jwt-payload';
import * as bcrypt from 'bcrypt'
import { LoginUserDTO } from 'src/models/users/login.user.dto';
import { UserRole } from 'src/core/enum/user-role.enum';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  async findUserByEmail(email: string, userName?: string): Promise<User> {

    return !userName ? await this.userRepository.findOne({
      where: {
        email,
        isDeleted: false,
      },
      relations: ["isBanned"]
     }) : await this.userRepository.findOne({
      where: {
        email,
        userName,
        isDeleted: false,
      },
      relations: ["isBanned"]
     })
  }

  async validateUser(email: string, password: string, userName?: string): Promise<User> {
    const user = await this.findUserByEmail(email, userName);

    if (!user) {
      return null;
    }

    if (userName) {



      if (user.role !== UserRole.Admin) {
        return null;
      }
    } else {

      if (user.role !== UserRole.User) {
        return null;
      }
    }


    const isUserValidated = await bcrypt.compare(password, user.password);
    return isUserValidated
            ? user
            : null;
  }

  async login(loginUser: LoginUserDTO): Promise<{ token: string }> {
    const user = await this.validateUser(loginUser.email, loginUser.password, loginUser?.userName);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials!');
    }

    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      role: UserRole[user.role],
      isBanned: user.isBanned === null ? false : true,
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
