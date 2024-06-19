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
exports.ProductController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const update_product_dto_1 = require("./dto/update-product.dto");
const swagger_1 = require("@nestjs/swagger");
const create_product_dto_1 = require("./dto/create-product.dto");
const validatePresentation_pipe_1 = require("../pipes/validatePresentation.pipe");
const pagination_dto_1 = require("../dto/pagination.dto");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    create(createProductDto) {
        return this.productService.create(createProductDto);
    }
    findAll(pagination) {
        return this.productService.findAll(pagination);
    }
    findOne(id) {
        return this.productService.findOne(id);
    }
    updateFlavor(id, updateFlavorDto) {
        return this.productService.updateFlavor(id, updateFlavorDto);
    }
    removeFlavor(id, updateFlavorDto) {
        return this.productService.removeFlavor(id, updateFlavorDto);
    }
    inactiveProduct(id) {
        return this.productService.inactiveProduct(id);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(validatePresentation_pipe_1.validatePresentation),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./entities/product.entity").Product] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQuery]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./entities/product.entity").Product }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('/addFlavor/:id'),
    openapi.ApiResponse({ status: 200, type: require("./entities/product.entity").Product }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.updateFlavorDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateFlavor", null);
__decorate([
    (0, common_1.Put)('/removeFlavor/:id'),
    openapi.ApiResponse({ status: 200, type: require("./entities/product.entity").Product }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.updateFlavorDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "removeFlavor", null);
__decorate([
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "inactiveProduct", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    (0, swagger_1.ApiTags)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map