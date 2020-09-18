import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
  public async update(id: string, currentPassword: string, newPassword: string): Promise<ReturnUserDTO> {
    const user = await this.usersRepo.findOne({
      where: { id: id, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException(
        `User with id: ${id} is not found or has been deleted`,
      );
    }
    const isPasswordValid = bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid Password");
    }
    if (!/^[a-zA-Z0-9]{6,16}$/.test(newPassword)) {
      // throw some exception
    }
    if (!/\d/.test(newPassword)) {
      // throw some exception
    }
    if (!/[A-Z]/.test(newPassword)) {
      // throw some exception
    }

    user.password = await bcrypt.hash(newPassword, 10)

    ;

    return this.transform.toReturnUserDto(await this.usersRepo.save(user));
  }

  public async upload(id: string, filename: string): Promise<ReturnUserDTO> {

    console.log(filename);
    
    const user = await this.usersRepo.findOne({
      where: { id: id, isDeleted: false },
    })

    user.avatarURL = filename;

    return this.transform.toReturnUserDto(await this.usersRepo.save(user))
  }

  }
