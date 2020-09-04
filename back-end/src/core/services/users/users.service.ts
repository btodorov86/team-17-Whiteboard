import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from 'src/models/users/create.user.dto';
import { ReturnUserDTO } from 'src/models/users/return.user.dto';
import { User } from 'src/models/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransformService } from '../transform/transform.service';
import * as bcrypt from 'bcrypt';
// import { Cron } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly transform: TransformService,
  ) {}

  // @Cron('40 * * * * * ')
  // logOn(): void {
  // }
  public async all(): Promise<Partial<ReturnUserDTO>[]> {
    const allUsers = await this.usersRepo.find({
      where: { isDeleted: false },
      relations: [
        'whiteboards',
      ],
    });
    return allUsers.map(user => this.transform.toReturnUserDto(user));
  }
  public async getOne(id: string): Promise<Partial<ReturnUserDTO>> {
    const user = await this.usersRepo.findOne({
      where: { id: id, isDeleted: false },
      relations: [
        'whiteboards',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} is not found`);
    }
    return this.transform.toReturnUserDto(user);
  }
  public async create(user: CreateUserDTO): Promise<Partial<ReturnUserDTO>> {

    const newUser: CreateUserDTO = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      password: await bcrypt.hash(user.password, 10),
    };

    // if (user.role) {
    //     // const role = UserRole[user.role]
    //     this.validator.checkRoleValue(user.role);
    //     newUser.role = user.role;
    // }

    return this.transform.toReturnUserDto(
      await this.usersRepo.save(newUser),
      true,
    );
  }
  public async delete(id: string): Promise<string> {
    const user = await this.usersRepo.findOne({
      where: { id: id, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException(
        `User with id: ${id} is not found or has been deleted`,
      );
    }

    user.isDeleted = true;
    this.usersRepo.save(user);

    return 'User is deleted';
  }
  // public async unDelete(id: string): Promise<string> {
  //   const user = await this.usersRepo.findOne({
  //     where: { id: id, isDeleted: true },
  //   });

  //   if (!user) {
  //     throw new NotFoundException(`User with id: ${id} is not found`);
  //   }

  //   user.isDeleted = false;
  //   this.usersRepo.save(user);

  //   return 'User is restored';
  // }

  }
