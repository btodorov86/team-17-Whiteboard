import { Injectable } from '@nestjs/common';
import { User } from 'src/models/users/user.entity';
import { ReturnUserDTO } from 'src/models/users/return.user.dto';

@Injectable()
export class TransformService {
  toReturnUserDto(user: User, token = false): Partial<ReturnUserDTO> {
    if (token) {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userName: user.userName,
        avatarURL: user.avatarURL,

      };
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      avatarURL: user.avatarURL,

    };
  }
}
