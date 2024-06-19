"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let UserService = class UserService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async create(user) {
        const findEmail = await this.userRepository.findOne({
            where: { email: user.email },
        });
        if (findEmail)
            throw new common_1.ConflictException('Email already exists');
        const hashPassword = await bcrypt.hash(user.password, 10);
        if (!hashPassword)
            throw new common_1.BadRequestException('Password could not be hashed');
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
    async loginUser(login) {
        if (!login.email || !login.password)
            throw new common_1.BadRequestException('Please enter your email and Password');
        const emailUser = await this.userRepository.findOne({
            where: { email: login.email },
        });
        if (!emailUser) {
            throw new common_1.UnauthorizedException('Email not Found or Password not Valid');
        }
        const checkPassword = await bcrypt.compare(login.password, emailUser.password);
        if (!checkPassword) {
            throw new common_1.UnauthorizedException('Email not Found or Password not Valid');
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
    async findOne(id) {
        const foundUser = await this.userRepository.findOne({
            where: { id: id },
            relations: { orders: true },
        });
        if (!foundUser) {
            throw new common_1.NotFoundException('User notFound');
        }
        const { password, role, ...userNotPassword } = await foundUser;
        return userNotPassword;
    }
    async createAdmin(id) {
        const user = await this.userRepository.findOne({ where: { id: id } });
        if (!user)
            throw new common_1.NotFoundException('user not found');
        await this.userRepository.update(user.id, {
            role: user_entity_1.Role.ADMIN,
        });
        return `User ${id} change to admin`;
    }
    async inactiveUser(id) {
        const user = await this.userRepository.findOneBy({ id: id });
        if (!user)
            throw new common_1.NotFoundException('user not found');
        await this.userRepository.update(user.id, {
            isActive: false,
        });
        return `User ${id} change to inactive`;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map