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
const product_entity_1 = require("../product/entities/product.entity");
const pagination_1 = require("../utils/pagination");
let UserService = class UserService {
    constructor(userRepository, productRepository, jwtService) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
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
            country: user.country,
        };
        const userSaved = await this.userRepository.save(newUser);
        const { id, isActive, role, name, lastname, email, country } = userSaved;
        return { id, isActive, role, name, lastname, email, country };
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
        const users = await this.userRepository.find({
            relations: { orders: true },
        });
        const usersNotPassword = users.map((user) => {
            const { password, ...userNotPassWord } = user;
            return userNotPassWord;
        });
        const sliceUsers = (0, pagination_1.fnPagination)(page, limit, usersNotPassword);
        return sliceUsers;
    }
    async findOne(id) {
        const foundUser = await this.userRepository.findOne({
            where: { id: id },
            relations: ['orders', 'favoriteProducts'],
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
    async makeFavorite(favorite) {
        const { userId, productId } = favorite;
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: { favoriteProducts: true },
        });
        if (!user)
            throw new common_1.NotFoundException('UserNot Found');
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Product Not Found');
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
    async removeFavorite(userId, productId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favorites'],
        });
        if (!user)
            throw new common_1.NotFoundException('User Not Found');
        const filterFavoritesUser = user.favoriteProducts.filter((product) => product.id !== productId);
        await this.userRepository.update({ id: userId }, { favoriteProducts: filterFavoritesUser });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map