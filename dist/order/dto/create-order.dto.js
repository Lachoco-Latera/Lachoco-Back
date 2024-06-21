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
exports.CreateOrderDto = exports.ProductOrder = exports.FlavorOrderDTO = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class FlavorOrderDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { flavorId: { required: true, type: () => String }, cantidad: { required: true, type: () => Number } };
    }
}
exports.FlavorOrderDTO = FlavorOrderDTO;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Flavor ID, has to be UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], FlavorOrderDTO.prototype, "flavorId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, swagger_1.ApiProperty)({
        description: 'Quantity of the flavor',
        example: 3,
    }),
    __metadata("design:type", Number)
], FlavorOrderDTO.prototype, "cantidad", void 0);
class ProductOrder {
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => String }, cantidad: { required: true, type: () => Number }, flavors: { required: true, type: () => [require("./create-order.dto").FlavorOrderDTO] } };
    }
}
exports.ProductOrder = ProductOrder;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Product ID, has to be UUID',
        example: '887a8887-598b-4240-a7da-4c751a9ab2d3',
    }),
    __metadata("design:type", String)
], ProductOrder.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, swagger_1.ApiProperty)({
        description: 'Quantity of the product',
        example: 3,
    }),
    __metadata("design:type", Number)
], ProductOrder.prototype, "cantidad", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FlavorOrderDTO),
    (0, swagger_1.ApiProperty)({
        description: 'Array of flavors with ID and quantity',
        example: '[{"flavorid":"123e4567-e89b-12d3-a456-426614174000", "cantidad":3}]',
    }),
    __metadata("design:type", Array)
], ProductOrder.prototype, "flavors", void 0);
class CreateOrderDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, products: { required: true, type: () => [require("./create-order.dto").ProductOrder] } };
    }
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        description: 'User ID, has to be UUID',
        example: '887a8887-598b-4240-a7da-4c751a9ab2d3',
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProductOrder),
    (0, swagger_1.ApiProperty)({
        description: 'Array of products with ID and quantity',
        example: '[{"id":"887a8887-598b-4240-a7da-4c751a9ab2d3", "cantidad":3}]',
    }),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "products", void 0);
//# sourceMappingURL=create-order.dto.js.map