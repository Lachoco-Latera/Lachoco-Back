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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.label = exports.category = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const image_entity_1 = require("./image.entity");
const sabor_entity_1 = require("./sabor.entity");
var category;
(function (category) {
    category["BOMBAS"] = "bombas";
    category["TABLETAS"] = "tabletas";
    category["BOMBONES"] = "bombones";
})(category || (exports.category = category = {}));
var label;
(function (label) {
    label["ONLINE"] = "SoloOnline";
    label["NEW"] = "nuevo";
})(label || (exports.label = label = {}));
let Product = class Product {
    constructor() {
        this.id = (0, uuid_1.v4)();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String, default: (0, uuid_1.v4)() }, category: { required: true, enum: require("./product.entity").category }, presentacion: { required: true, type: () => Number }, description: { required: true, type: () => String }, price: { required: true, type: () => Number }, stock: { required: true, type: () => Number }, label: { required: true, enum: require("./product.entity").label }, isActive: { required: true, type: () => Boolean }, images: { required: true, type: () => [require("./image.entity").Image] }, flavors: { required: true, type: () => [require("./sabor.entity").Flavor] } };
    }
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: category, nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: false }),
    __metadata("design:type", Number)
], Product.prototype, "presentacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: false }),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: label, default: label.NEW }),
    __metadata("design:type", String)
], Product.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => image_entity_1.Image, (image) => image.product),
    (0, typeorm_1.JoinColumn)({ name: 'img_id' }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => sabor_entity_1.Flavor),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Product.prototype, "flavors", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)({
        name: 'products',
    })
], Product);
//# sourceMappingURL=product.entity.js.map