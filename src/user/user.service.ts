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
import { Product } from 'src/product/entities/product.entity';
import { userFavorites } from './dto/userFavorite.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { updateUserDto } from './dto/updateUser.dto';
import { EmailService } from 'src/email/email.service';
import { UserCreatedEvent } from './user.registerEvent';
import { bodyRegister } from './emailBody/bodyRegister';
import { PaginationQuery } from 'src/dto/pagination.dto';
import Stripe from 'stripe';
import { transporter } from 'src/utils/transportNodemailer';

const stripe = new Stripe(process.env.KEY_STRIPE);
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    private emailService: EmailService,
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
      country: user.country,
    };

    const userSaved = await this.userRepository.save(newUser);

    if (!userSaved) throw new BadRequestException('Registro fallido');

    const { id, isActive, role, name, lastname, email, country } = userSaved;

    this.eventEmitter.emit('user.created', new UserCreatedEvent(id));
    return { id, isActive, role, name, lastname, email, country };
  }

  async loginUser(login: LoginDto) {
    if (!login.email || !login.password)
      throw new BadRequestException('Please enter your email and Password');

    const emailUser = await this.userRepository.findOne({
      where: { email: login.email },
      relations: { suscriptionPro: true },
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

    //   let subscription;

    //   if (emailUser.suscriptionId === null) {
    //     subscription = null;
    //   } else {
    //     subscription = await stripe.subscriptions.retrieve(
    //       emailUser.suscriptionId,
    //     );
    //   }
    // const sendSubscription = {
    //   start: subscription?.current_period_start || null,
    //   end: subscription?.current_period_end || null,
    //   plan: subscription?.items.data[0]?.plan?.nickname || null,
    //   };

    const token = this.jwtService.sign(payload);
    return {
      success: 'Login Success',
      token,
      subscription: emailUser.suscriptionPro,
    };
  }

  async findAll(pagination?: PaginationQuery) {
    const defaultPage = pagination?.page || 1;
    const defaultLimit = pagination?.limit || 15;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const users = await this.userRepository.find({
      relations: {
        orders: true,
        giftcards: { product: true },
        suscriptionPro: true,
      },
    });

    const usersNotPassword = users.map((user) => {
      const { password, ...userNotPassWord } = user;
      return userNotPassWord;
    });

    const sliceUsers = usersNotPassword.slice(startIndex, endIndex);

    return sliceUsers;
  }

  async findOne(id: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
      relations: ['orders', 'favoriteProducts'],
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

  async createClient(id) {
    //const prueba = Object.values(id);
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException('user not found');

    await this.userRepository.update(user.id, {
      role: Role.CLIENT,
    });
    return `User ${id} change to client`;
  }

  async inactiveUser(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) throw new NotFoundException('user not found');

    await this.userRepository.update(user.id, {
      isActive: false,
    });
    return `User ${id} change to inactive`;
  }

  async makeFavorite(favorite: userFavorites) {
    const { userId, productId } = favorite;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { favoriteProducts: true },
    });
    if (!user) throw new NotFoundException('UserNot Found');

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product Not Found');

    if (user && product) {
      user.favoriteProducts.push(product);
      await this.userRepository.save(user);

      const userSelection = await this.userRepository.findOne({
        where: { id: user.id },
        relations: { favoriteProducts: true },
      });

      const userToReturn = {
        userId: userSelection.id,
        favoritesProducts: userSelection.favoriteProducts.map((p) => p.id),
      };
      return userToReturn;
    }
  }

  async removeFavorite(userId: string, productId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    if (!user) throw new NotFoundException('User Not Found');
    const filterFavoritesUser = user.favoriteProducts.filter(
      (product) => product.id !== productId,
    );
    await this.userRepository.update(
      { id: userId },
      { favoriteProducts: filterFavoritesUser },
    );
  }

  async editUser(id: string, updateUser: updateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    await this.userRepository.update({ id: id }, { ...updateUser });
    return `Usuario ${id} Actualizado`;
  }

  //*Evento al crear usuario
  @OnEvent('user.created')
  private async sendEmail(payload: UserCreatedEvent) {
    const userId = await this.userRepository.findOne({
      where: { id: payload.userId },
    });

    const template = bodyRegister(
      userId.email,
      'Bienvenido a Chocolatera',
      userId,
    );

    const info = await transporter.sendMail({
      from: '"Lachoco-latera" <ventas_lachoco_latera@hotmail.com>', // sender address
      to: userId.email, // list of receivers
      subject: '¡Bienvenido a Lachoco Latera!', // Subject line
      text: 'Confirmación de Registro', // plain text body
      html: template, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // const mail = {
    //   to: userId.email,
    //   subject: '¡Bienvenido a Lachoco Latera!',
    //   text: 'Confirmación de Registro',
    //   template: template,
    // };
    // await this.emailService.sendPostulation(mail);
  }
}
