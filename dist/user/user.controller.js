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
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_dto_1 = require("./dto/login.dto");
const pagination_dto_1 = require("../dto/pagination.dto");
const swagger_1 = require("@nestjs/swagger");
const swagger_user_1 = require("./swagger.user");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    signin(login) {
        return this.userService.loginUser(login);
    }
    findAll(pagination) {
        return this.userService.findAll(pagination);
    }
    createAdmin(id) {
        return this.userService.createAdmin(id);
    }
    remove(id) {
        return this.userService.inactiveUser(id);
    }
    findOne(id) {
        return this.userService.findOne(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Usuario creado exitosamente',
        schema: {
            example: swagger_user_1.exampleCreatedUser,
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validacion fallida',
        schema: {
            example: swagger_user_1.userValidationsErrors,
        },
    }),
    (0, swagger_1.ApiResponse)(swagger_user_1.userAlreadyExists),
    (0, swagger_1.ApiOperation)({
        summary: 'Registro de usuario',
        description: 'Registro de usuario',
    }),
    (0, common_1.Post)('/register'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.createUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Inicio de sesion exitoso',
        schema: {
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlkIjoxLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IkFETUlOIn0.1',
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Usuario no encontrado',
        schema: {
            example: {
                message: 'Usuario no encontrado',
                error: 'Bad Request',
            },
        },
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Inicio de sesion',
        description: 'Inicio de sesion',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "signin", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Listar todos los usuarios exitosamente',
        schema: {
            example: [swagger_user_1.exampleCreatedUser],
        },
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar todos los usuarios',
        description: 'Lista todos los usuarios en la base de datos',
    }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQuery]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)('/admin/:id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Put)('/inactive/:id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Usuario por ID',
        schema: {
            example: [swagger_user_1.exampleCreatedUser],
        },
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Usuario Por ID',
        description: 'Usuario Por ID',
    }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('Users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map