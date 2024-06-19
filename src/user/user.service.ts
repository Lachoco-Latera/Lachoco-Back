import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(user: createUserDto) {
    const findEmail = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (findEmail) throw new ConflictException('Email already exists');

    const hashPassword = await bcrypt.hash(user.password, 10);
    if (!hashPassword)
      throw new BadRequestException('Password could not be hashed');

    const newUser = {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      password: hashPassword,
    };

    const userSaved = await this.userRepository.save(newUser);

    const { id, isActive, role, name, lastname, email } = userSaved;

    return { id, isActive, role, name, lastname, email };
  }

  async loginUser(login: LoginDto) {
    if (!login.email || !login.password)
      throw new BadRequestException('Please enter your email and Password');

    const emailUser = await this.userRepository.findOne({
      where: { email: login.email },
    });

    if (!emailUser) {
      throw new UnauthorizedException('Email not Found or Password not Valid');
    }

    const checkPassword = await bcrypt.compare(
      login.password,
      emailUser.password,
    );
    if (!checkPassword) {
      throw new UnauthorizedException('Email not Found or Password not Valid');
    }

    const payload = {
      id: emailUser.id,
      email: emailUser.email,
      role: [emailUser.role],
    };

    const token = this.jwtService.sign(payload);
    return { success: 'Login Success', token };
  }

  async findAll(pagination) {
    const { page, limit } = pagination;
    const defaultPage = page || 1;
    const defaultLimit = limit || 5;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const users = await this.userRepository.find({
      relations: { orders: true },
    });

    const usersNotPassword = users
      .map((user) => {
        const { password, ...userNotPassWord } = user;
        return userNotPassWord;
      })
      .slice(startIndex, endIndex);

    return usersNotPassword;
  }

  async findOne(id: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
      relations: { orders: true },
    });
    if (!foundUser) {
      throw new NotFoundException('User notFound');
    }
    const { password, role, ...userNotPassword } = await foundUser;
    return userNotPassword;
  }

  async createAdmin(id) {
    //const prueba = Object.values(id);
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException('user not found');

    await this.userRepository.update(user.id, {
      role: Role.ADMIN,
    });
    return `User ${id} change to admin`;
  }
  async inactiveUser(id: string) {
    //const prueba = Object.values(id);
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) throw new NotFoundException('user not found');

    await this.userRepository.update(user.id, {
      isActive: false,
    });
    return `User ${id} change to inactive`;
  }
}
