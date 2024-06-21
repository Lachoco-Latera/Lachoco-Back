"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const order_controller_1 = require("./order.controller");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entities/order.entity");
const orderDetail_entity_1 = require("./entities/orderDetail.entity");
const product_entity_1 = require("../product/entities/product.entity");
const user_entity_1 = require("../user/entities/user.entity");
const orderDetailsProdusct_entity_1 = require("./entities/orderDetailsProdusct.entity");
const flavor_entity_1 = require("../flavor/entities/flavor.entity");
const flavorDetail_entity_1 = require("./entities/flavorDetail.entity");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                order_entity_1.Order,
                orderDetail_entity_1.OrderDetail,
                product_entity_1.Product,
                user_entity_1.User,
                orderDetailsProdusct_entity_1.OrderDetailProduct,
                flavorDetail_entity_1.OrderDetailFlavor,
                flavor_entity_1.Flavor,
            ]),
        ],
        controllers: [order_controller_1.OrderController],
        providers: [order_service_1.OrderService],
    })
], OrderModule);
//# sourceMappingURL=order.module.js.map