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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const typeorm_2 = require("typeorm");
const image_entity_1 = require("./entities/image.entity");
const flavor_entity_1 = require("../flavor/entities/flavor.entity");
let ProductService = class ProductService {
    constructor(productRepository, imageRepository, flavorRepository) {
        this.productRepository = productRepository;
        this.imageRepository = imageRepository;
        this.flavorRepository = flavorRepository;
    }
    async create(createProductDto) {
        const imageEntities = createProductDto.images.map((imageUrl) => this.imageRepository.create({ img: imageUrl }));
        const savedImages = await this.imageRepository.save(imageEntities);
        const newProduct = {
            ...createProductDto,
            images: savedImages,
            flavors: null,
        };
        return await this.productRepository.save(newProduct);
    }
    async findAll(pagination) {
        const { page, limit } = pagination ?? {};
        const defaultPage = page ?? 1;
        const defaultLimit = limit ?? 15;
        const startIndex = (defaultPage - 1) * defaultLimit;
        const endIndex = startIndex + defaultLimit;
        const products = await this.productRepository.find({
            relations: { flavors: true, images: true },
        });
        const sliceUsers = products.slice(startIndex, endIndex);
        return sliceUsers;
    }
    async findOne(id) {
        const findProdut = await this.productRepository.findOne({
            where: { id: id },
            relations: ['flavors', 'images'],
        });
        if (!findProdut)
            throw new common_1.NotFoundException('Product not found');
        return findProdut;
    }
    async updateFlavor(id, updateFlavorDto) {
        const findProduct = await this.productRepository.findOne({
            where: { id: id },
            relations: { flavors: true },
        });
        if (!findProduct)
            throw new common_1.NotFoundException('Product not found');
        const existingFlavors = findProduct.flavors.map((flavor) => flavor.name);
        const flavorsToAdd = updateFlavorDto.flavor.filter((flavor) => !existingFlavors.includes(flavor));
        if (flavorsToAdd.length > 0) {
            const flavorsToAddEntities = flavorsToAdd.map((name) => ({ name: name }));
            await this.flavorRepository.save(flavorsToAddEntities);
            findProduct.flavors = [...findProduct.flavors, ...flavorsToAddEntities];
            await this.productRepository.save(findProduct);
        }
        return findProduct;
    }
    async removeFlavor(id, updateFlavorDto) {
        const findProduct = await this.productRepository.findOne({
            where: { id: id },
            relations: { flavors: true },
        });
        if (!findProduct)
            throw new common_1.NotFoundException('Product not found');
        const flavorsToRemove = findProduct.flavors.filter((flavor) => updateFlavorDto.flavor.includes(flavor.name));
        if (flavorsToRemove.length > 0) {
            await this.flavorRepository.remove(flavorsToRemove);
            findProduct.flavors = findProduct.flavors.filter((flavor) => !flavorsToRemove.includes(flavor));
        }
        await this.productRepository.save(findProduct);
        return findProduct;
    }
    async inactiveProduct(id) {
        const findProduct = await this.productRepository.findOne({
            where: { id: id },
            relations: { flavors: true },
        });
        if (!findProduct)
            throw new common_1.NotFoundException('Product not found');
        await this.productRepository.update(findProduct.id, {
            isActive: false,
        });
        return `Product ${id} change to inactive`;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(image_entity_1.Image)),
    __param(2, (0, typeorm_1.InjectRepository)(flavor_entity_1.Flavor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map