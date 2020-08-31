import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from 'src/models/users/create.user.dto';
import { ReturnUserDTO } from 'src/models/users/return.user.dto';
import { User } from 'src/models/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransformService } from '../transform/transform.service';
import * as bcrypt from 'bcrypt';
// import { Cron } from '@nestjs/schedule';
import { UpdateUserDTO } from 'src/models/users/update.user.dto';

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
        'borrowedBooks',
        'readBooks',
        'reviews',
        'ratings',
        'reviews.reaction',
        'isBanned',
        'reviews.author'
      ],
    });
    return allUsers.map(user => this.transform.toReturnUserDto(user));
  }
  public async getOne(id: string): Promise<Partial<ReturnUserDTO>> {
    const user = await this.usersRepo.findOne({
      where: { id: id, isDeleted: false },
      relations: [
        'borrowedBooks',
        'readBooks',
        'reviews',
        'reviews.reaction',
        'isBanned',
        'ratings',
        'reviews.author'
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
      role: UserRole[String(user.role)],
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
  public async unDelete(id: string): Promise<string> {
    const user = await this.usersRepo.findOne({
      where: { id: id, isDeleted: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} is not found`);
    }

    user.isDeleted = false;
    this.usersRepo.save(user);

    return 'User is restored';
  }

  public async update(
    id: string,
    body: Partial<UpdateUserDTO>,
    loggedUserId: string,
  ): Promise<Partial<ReturnUserDTO>> {
    const loggedUser = await this.usersRepo.findOne({
        where: { id: loggedUserId, isDeleted: false },
      });

    const user = await this.usersRepo.findOne({
      where: { id: id, isDeleted: false },
    });


    if (!user) {
      throw new NotFoundException(`User with id: ${id} is not found`);
    }

    if (loggedUser.role === UserRole.Admin) {

      if (body.role !== user.role) {
        user.token = null;
      }

      let updateObj = {};

        body?.password
            ? updateObj = {
                firstName: body.firstName,
                lastName: body.lastName,
                password: await bcrypt.hash(body.password, 10),
                role: UserRole[body.role],}
            : updateObj = {
                firstName: body.firstName,
                lastName: body.lastName,
                role: UserRole[body.role],
              }

        return this.transform.toReturnUserDto(await this.usersRepo.save({...user, ...updateObj}), true)

    } else {

        if (id !== loggedUserId) {
            throw new UnauthorizedException(`Authorization fail`)
        }

        const updateObj: Partial<UpdateUserDTO> = {}

        if (body.firstName) {
          updateObj.firstName = body.firstName
        }
        if (body.lastName) {
          updateObj.lastName = body.lastName
        }
        if (body.password) {
          updateObj.password = await bcrypt.hash(body.password, 10)
        }

        return this.transform.toReturnUserDto(await this.usersRepo.save({...user, ...updateObj}), true)
    }
  }

public async upload(id: string, filename: string): Promise<Partial<ReturnUserDTO>> {

  const user = await this.usersRepo.findOne({
    where: { id: id, isDeleted: false },
  })

  user.avatarURL = filename;

  return this.transform.toReturnUserDto(await this.usersRepo.save(user), true)
}
}
